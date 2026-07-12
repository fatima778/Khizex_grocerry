import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getAllOrdersApi, updateOrderStatusApi } from "../../api/orders";
import type { Order } from "../../types";

const STATUSES = ["pending", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    const res = await getAllOrdersApi();
    setOrders(res.data);
    setIsLoading(false);
  }

  async function handleStatusChange(id: string, status: string) {
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    await updateOrderStatusApi(id, status);
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-forest-900 mb-1">Orders</h1>
      <p className="text-forest-700/50 text-sm mb-8">Update status — customers see changes instantly</p>

      <div className="bg-white rounded-2xl border border-forest-900/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-forest-700/50 border-b border-forest-900/5">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-forest-700/40">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-forest-700/40">No orders yet</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-forest-900/5 last:border-0">
                  <td className="px-5 py-3 font-mono text-xs text-forest-700/60">#{order._id.slice(-8)}</td>
                  <td className="px-5 py-3 text-forest-700/70">
                    {order.items.map((i) => i.name).join(", ")}
                  </td>
                  <td className="px-5 py-3 font-semibold text-forest-900">${order.total.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="px-3 py-1.5 border border-forest-900/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;
