import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PackageCheck, Clock, Truck, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import StorefrontLayout from "../layouts/StorefrontLayout";
import { getMyOrdersApi } from "../api/orders";
import type { Order } from "../types";
import { useSocket } from "../hooks/useSocket";
import { useAuthStore } from "../store/authStore";

const STATUS_META: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-forest-700/50 bg-forest-900/5" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-leaf-700 bg-leaf-500/10" },
  packed: { label: "Packed", icon: PackageCheck, color: "text-mustard-600 bg-mustard-500/10" },
  out_for_delivery: { label: "Out for delivery", icon: Truck, color: "text-coral-600 bg-coral-500/10" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-leaf-700 bg-leaf-500/15" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-50" },
};

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const confirmedId = searchParams.get("confirmed");
  const socketRef = useSocket();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    setError("");
    try {
      const res = await getMyOrdersApi();
      setOrders(res.data);
    } catch (err: any) {
      setError(
        err.response?.status === 401
          ? "Your session expired. Please log in again to see your orders."
          : "Couldn't load your orders right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Live order status tracking — updates instantly when the admin changes
  // an order's status, without needing a page refresh.
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !user) return;

    function handleStatusUpdate(payload: { orderId: string; status: string; userId: string }) {
      if (payload.userId !== user!.id) return;
      setOrders((prev) =>
        prev.map((o) => (o._id === payload.orderId ? { ...o, status: payload.status } : o))
      );
    }

    socket.on("order:status", handleStatusUpdate);
    return () => {
      socket.off("order:status", handleStatusUpdate);
    };
  }, [socketRef.current, user]);

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {confirmedId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-leaf-500/10 border border-leaf-500/20 text-leaf-700 rounded-2xl px-5 py-4 mb-8 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">
              Order placed successfully! Your fresh groceries are on their way.
            </p>
          </motion.div>
        )}

        <h1 className="font-display text-3xl font-bold text-forest-900 mb-8">Your orders</h1>

        {isLoading ? (
          <p className="text-forest-700/50">Loading your orders…</p>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-forest-900/5">
            <AlertCircle className="w-10 h-10 text-coral-500 mx-auto mb-3" />
            <p className="text-forest-900 font-semibold">{error}</p>
            <button
              onClick={loadOrders}
              className="mt-4 text-sm font-semibold text-leaf-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-forest-900/5">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-forest-900 font-semibold text-lg">No orders yet</p>
            <p className="text-forest-700/50 text-sm mt-1">Your order history will show up here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const meta = STATUS_META[order.status] || STATUS_META.pending;
              const Icon = meta.icon;
              return (
                <motion.div
                  key={order._id}
                  layout
                  className="bg-white rounded-2xl p-5 border border-forest-900/5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs text-forest-700/40 font-mono">#{order._id.slice(-8)}</p>
                      <p className="text-sm text-forest-700/60">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <motion.span
                      key={order.status}
                      initial={{ scale: 0.9, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${meta.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {meta.label}
                    </motion.span>
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-forest-700/70">
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-forest-900/10">
                    <span className="text-sm text-forest-700/50">{order.address}</span>
                    <span className="font-bold text-forest-900">${order.total.toFixed(2)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}

export default Orders;
