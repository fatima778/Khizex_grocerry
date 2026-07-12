import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Package, AlertTriangle, ShoppingBag, Wifi, WifiOff } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useSocket } from "../../hooks/useSocket";
import { getAllOrdersApi } from "../../api/orders";
import { getProductsApi } from "../../api/products";
import type { Order, Product } from "../../types";

interface LiveEvent {
  id: string;
  type: "order" | "stock" | "low-stock";
  message: string;
  time: string;
}

function AdminDashboard() {
  const socketRef = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    getAllOrdersApi().then((res) => setOrders(res.data));
    getProductsApi({ limit: 100 }).then((res) => setProducts(res.data.products));
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("order:new", (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      pushEvent({ type: "order", message: `New order placed — $${order.total.toFixed(2)}` });
    });

    socket.on("stock:update", ({ productId, stock }: { productId: string; stock: number }) => {
      setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, stock } : p)));
      pushEvent({ type: "stock", message: `Stock updated for a product → ${stock} left` });
    });

    socket.on("stock:low", ({ name, stock }: { name: string; stock: number }) => {
      pushEvent({ type: "low-stock", message: `Low stock alert: "${name}" has only ${stock} left` });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("order:new");
      socket.off("stock:update");
      socket.off("stock:low");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef.current]);

  function pushEvent(e: Omit<LiveEvent, "id" | "time">) {
    setEvents((prev) => [
      { ...e, id: `${Date.now()}-${Math.random()}`, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 19),
    ]);
  }

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const stats = [
    { label: "Total orders", value: orders.length, icon: ShoppingBag, color: "bg-leaf-500/10 text-leaf-700" },
    { label: "Revenue", value: `$${revenue.toFixed(2)}`, icon: TrendingUp, color: "bg-mustard-500/10 text-mustard-600" },
    { label: "Products live", value: products.length, icon: Package, color: "bg-forest-900/5 text-forest-800" },
    { label: "Low / out of stock", value: `${lowStockCount} / ${outOfStockCount}`, icon: AlertTriangle, color: "bg-coral-500/10 text-coral-600" },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">Live dashboard</h1>
          <p className="text-forest-700/50 text-sm mt-1">Real-time orders and inventory, no refresh needed</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
            connected ? "bg-leaf-500/10 text-leaf-700" : "bg-forest-900/5 text-forest-700/50"
          }`}
        >
          {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {connected ? "Live" : "Connecting…"}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-forest-900/5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-forest-900">{value}</p>
            <p className="text-xs text-forest-700/50 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-forest-900/5">
          <h2 className="font-semibold text-forest-900 mb-4">Live activity feed</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {events.length === 0 && (
                <p className="text-sm text-forest-700/40">Waiting for activity… place an order to see it appear here instantly.</p>
              )}
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-2 text-sm px-3 py-2.5 rounded-xl ${
                    event.type === "low-stock" ? "bg-coral-500/10 text-coral-700" : "bg-field-100/60 text-forest-800"
                  }`}
                >
                  <span className="flex-1">{event.message}</span>
                  <span className="text-[11px] text-forest-700/40 shrink-0">{event.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-forest-900/5">
          <h2 className="font-semibold text-forest-900 mb-4">Recent orders</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {orders.slice(0, 10).map((order) => (
              <div key={order._id} className="flex items-center justify-between text-sm px-3 py-2.5 rounded-xl bg-field-100/60">
                <span className="text-forest-700/70 font-mono text-xs">#{order._id.slice(-8)}</span>
                <span className="text-forest-700/60">{order.status}</span>
                <span className="font-semibold text-forest-900">${order.total.toFixed(2)}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-forest-700/40">No orders yet</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
