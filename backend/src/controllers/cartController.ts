import { Response } from "express";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { AuthRequest } from "../middleware/auth";

export async function getCart(req: AuthRequest, res: Response): Promise<void> {
  const cart = await Cart.findOne({ user: req.user!.userId }).populate("items.product");
  res.status(200).json(cart || { user: req.user!.userId, items: [] });
}

export async function addToCart(req: AuthRequest, res: Response): Promise<void> {
  const { productId, quantity } = req.body as { productId: string; quantity: number };

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  let cart = await Cart.findOne({ user: req.user!.userId });
  if (!cart) {
    cart = await Cart.create({ user: req.user!.userId, items: [] });
  }

  const existingItem = cart.items.find((item) => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: product._id as any, quantity });
  }

  await cart.save();
  const populated = await cart.populate("items.product");
  res.status(200).json(populated);
}

export async function updateCartItem(req: AuthRequest, res: Response): Promise<void> {
  const { productId, quantity } = req.body as { productId: string; quantity: number };

  const cart = await Cart.findOne({ user: req.user!.userId });
  if (!cart) {
    res.status(404).json({ message: "Cart not found" });
    return;
  }

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    res.status(404).json({ message: "Item not in cart" });
    return;
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  const populated = await cart.populate("items.product");
  res.status(200).json(populated);
}

export async function removeFromCart(req: AuthRequest, res: Response): Promise<void> {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user!.userId });
  if (!cart) {
    res.status(404).json({ message: "Cart not found" });
    return;
  }

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();

  const populated = await cart.populate("items.product");
  res.status(200).json(populated);
}
