import { Response } from "express";
import mongoose from "mongoose";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { calculatePricing } from "../utils/pricing";
import { processMockPayment } from "../services/mockPaymentService";
import { AuthRequest } from "../middleware/auth";
import { emitStockUpdate, emitNewOrder, emitLowStockAlert } from "../services/socketService";

export async function checkout(req: AuthRequest, res: Response): Promise<void> {
  const { address, cardNumber } = req.body as { address: string; cardNumber: string };
  const userId = req.user!.userId;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    res.status(400).json({ message: "Cart is empty" });
    return;
  }

  // ---- STEP 1: Atomic, concurrency-safe stock validation & decrement ----
  // Each item is decremented with a conditional filter (stock >= quantity).
  // This is a single atomic operation per product at the database level —
  // MongoDB guarantees no two concurrent requests can both pass this check
  // for the same unit of stock. This is what prevents overselling under
  // simultaneous purchase attempts, instead of the unsafe pattern of
  // "read stock in app code, check it, then write" which has a race window.
  const decrementedProducts: { productId: string; quantity: number }[] = [];

  try {
    for (const item of cart.items) {
      const productId = (item.product as any)._id;
      const quantity = item.quantity;

      const updated = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!updated) {
        // Stock ran out for this item — roll back everything decremented so far
        await rollbackStock(decrementedProducts);
        res.status(409).json({
          message: `"${(item.product as any).name}" no longer has enough stock. Please update your cart.`,
        });
        return;
      }

      decrementedProducts.push({ productId: productId.toString(), quantity });

      // Real-time push to admin dashboard: stock changed
      emitStockUpdate(updated.id, updated.stock);

      // Real-time low-stock alert if threshold crossed
      if (updated.stock <= updated.lowStockThreshold) {
        emitLowStockAlert(updated.id, updated.name, updated.stock);
      }
    }
  } catch (error) {
    await rollbackStock(decrementedProducts);
    throw error;
  }

  // ---- STEP 2: Process mock payment (simulated sandbox gateway) ----
  const pricing = calculatePricing(
    cart.items.reduce((sum, item) => sum + (item.product as any).price * item.quantity, 0)
  );

  const paymentResult = processMockPayment({ cardNumber, amount: pricing.total });

  if (!paymentResult.success) {
    // Payment failed — restore all decremented stock
    await rollbackStock(decrementedProducts);
    res.status(402).json({ message: paymentResult.message });
    return;
  }

  // ---- STEP 3: Idempotency check ----
  // If this exact paymentId was already processed (e.g., duplicate webhook
  // or double form submission), don't create a duplicate order.
  const existingOrder = await Order.findOne({ paymentId: paymentResult.paymentId });
  if (existingOrder) {
    res.status(200).json(existingOrder);
    return;
  }

  // ---- STEP 4: Create the order record ----
  const order = await Order.create({
    user: userId,
    items: cart.items.map((item) => ({
      product: (item.product as any)._id,
      name: (item.product as any).name,
      price: (item.product as any).price,
      quantity: item.quantity,
    })),
    subtotal: pricing.subtotal,
    tax: pricing.tax,
    deliveryFee: pricing.deliveryFee,
    total: pricing.total,
    address,
    status: "confirmed",
    paymentId: paymentResult.paymentId,
    paymentStatus: "paid",
  });

  // ---- STEP 5: Clear the cart ----
  cart.items = [];
  await cart.save();

  // Real-time push to admin dashboard: new order placed
  emitNewOrder(order);

  res.status(201).json(order);
}

// Restores stock for items that were decremented before a failure occurred,
// so a failed payment or partial stock issue never permanently loses stock.
async function rollbackStock(items: { productId: string; quantity: number }[]): Promise<void> {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
  }
}