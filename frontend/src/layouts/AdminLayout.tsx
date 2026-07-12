import { useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ClipboardList, LogOut, ShoppingBasket, Store, Menu, X, Users, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { logoutApi } from "../api/auth";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/complaints", label: "Complaints", icon: MessageCircle },
  { to: "/admin/staff", label: "Staff & Admins", icon: Users },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  async function handleLogout() {
    try {
      await logoutApi();
    } catch {
      /* ignore */
    }
    logout();
    navigate("/");
  }

  return (
    <>
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="w-9 h-9 rounded-xl bg-leaf-500 flex items-center justify-center">
          <ShoppingBasket className="w-4 h-4 text-forest-900" />
        </div>
        <span className="font-display text-lg font-bold text-white">Khizex Admin</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "bg-leaf-500 text-forest-900" : "text-field-100/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 space-y-1 border-t border-white/10">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-field-100/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Store className="w-4 h-4" /> View storefront
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-field-100/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </>
  );
}

function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-field-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-forest-900 text-field-50 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-forest-900 text-white flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-leaf-500 flex items-center justify-center">
            <ShoppingBasket className="w-4 h-4 text-forest-900" />
          </div>
          <span className="font-display text-base font-bold">Khizex Admin</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-forest-900 text-field-50 flex flex-col z-50"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
