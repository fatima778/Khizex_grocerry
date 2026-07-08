import { Server } from "socket.io";

let io: Server | null = null;

export function initSocket(server: Server): void {
  io = server;
}

export function emitStockUpdate(productId: string, newStock: number): void {
  io?.emit("stock:update", { productId, stock: newStock });
}

export function emitLowStockAlert(productId: string, name: string, stock: number): void {
  io?.emit("stock:low", { productId, name, stock });
}

export function emitNewOrder(order: unknown): void {
  io?.emit("order:new", order);
}

export function emitOrderStatusUpdate(orderId: string, status: string, userId: string): void {
  io?.emit("order:status", { orderId, status, userId });
}