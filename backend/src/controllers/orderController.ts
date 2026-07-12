import { Response } from "express";
import { Order } from "../models/Order";
import { AuthRequest } from "../middleware/auth";
import { emitOrderStatusUpdate } from "../services/socketService";

export async function getMyOrders(req: AuthRequest, res: Response): Promise<void> {
  const orders = await Order.find({ user: req.user!.userId }).sort({ createdAt: -1 });
  res.status(200).json(orders);
}

export async function getAllOrders(_req: AuthRequest, res: Response): Promise<void> {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.status(200).json(orders);
}

export async function updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
  const { status } = req.body as { status: string };

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  emitOrderStatusUpdate(order.id, order.status, order.user.toString());
  res.status(200).json(order);
}
