import { Response } from "express";
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
        await rollbackStock(decrementedProducts);
        res.status(409).json({
          message: `"${(item.product as any).name}" no longer has enough stock. Please update your cart.`,
        });
        return;
      }

      decrementedProducts.push({ productId: productId.toString(), quantity });

      emitStockUpdate(updated.id, updated.stock);

      if (updated.stock <= updated.lowStockThreshold) {
        emitLowStockAlert(updated.id, updated.name, updated.stock);
      }
    }
  } catch (error) {
    await rollbackStock(decrementedProducts);
    throw error;
  }

  const pricing = calculatePricing(
    cart.items.reduce((sum, item) => sum + (item.product as any).price * item.quantity, 0)
  );

  const paymentResult = processMockPayment({ cardNumber, amount: pricing.total });

  if (!paymentResult.success) {
    await rollbackStock(decrementedProducts);
    res.status(402).json({ message: paymentResult.message });
    return;
  }

  const existingOrder = await Order.findOne({ paymentId: paymentResult.paymentId });
  if (existingOrder) {
    res.status(200).json(existingOrder);
    return;
  }

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

  cart.items = [];
  await cart.save();

  emitNewOrder(order);

  res.status(201).json(order);
}

async function rollbackStock(items: { productId: string; quantity: number }[]): Promise<void> {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
  }
}
