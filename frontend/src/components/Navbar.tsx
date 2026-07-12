import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBasket, User, LogOut, Search, Menu, X, LayoutDashboard, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { logoutApi } from "../api/auth";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  async function handleLogout() {
    try {
      await logoutApi();
    } catch {
      /* ignore */
    }
    logout();
    navigate("/");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`);
  }

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-white border-b border-forest-900/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-6 h-16">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-forest-900/5"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center text-mustard-400">
                <ShoppingBasket className="w-4 h-4" />
              </div>
              <span className="font-display text-lg sm:text-xl font-bold text-forest-900">
                KhizexGrocery<span className="text-leaf-600">.</span>
              </span>
            </Link>

            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-700/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search fresh groceries, brands, categories..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-field-50 border border-forest-900/10 focus:outline-none focus:ring-2 focus:ring-leaf-400 text-sm"
                />
              </div>
            </form>

            <button className="hidden lg:flex items-center gap-2 text-sm shrink-0">
              <MapPin className="w-4 h-4 text-leaf-600" />
              <span className="text-left leading-tight">
                <span className="block text-[11px] text-forest-700/50">Deliver to</span>
                <span className="block font-semibold text-forest-900">Karachi, PK</span>
              </span>
            </button>

            <div className="flex items-center gap-1 sm:gap-2 ml-auto lg:ml-0">
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-1">
                  {user?.role === "admin" && (
                    <Link to="/admin" className="p-2.5 rounded-full hover:bg-forest-900/5" title="Admin dashboard">
                      <LayoutDashboard className="w-5 h-5 text-forest-800" />
                    </Link>
                  )}
                  <Link to="/orders" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-forest-900/5">
                    <User className="w-4 h-4 text-forest-700" />
                    <span className="text-left leading-tight">
                      <span className="block text-[11px] text-forest-700/50">Hi, {user?.name.split(" ")[0]}</span>
                      <span className="block text-xs font-semibold text-forest-900">Account</span>
                    </span>
                  </Link>
                  <button onClick={handleLogout} className="p-2.5 rounded-full hover:bg-forest-900/5" title="Log out">
                    <LogOut className="w-4 h-4 text-forest-700/60" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-forest-900/5">
                  <User className="w-4 h-4 text-forest-700" />
                  <span className="text-left leading-tight">
                    <span className="block text-[11px] text-forest-700/50">Login</span>
                    <span className="block text-xs font-semibold text-forest-900">Account</span>
                  </span>
                </Link>
              )}

              <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-forest-900/5">
                <ShoppingBasket className="w-5 h-5 text-forest-800" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-coral-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Category quick-links bar — Metro-style secondary nav */}
      <nav className="hidden md:block bg-forest-900 border-b border-forest-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-7 h-11 text-sm">
            {["Fruits & Vegetables", "Dairy", "Bakery", "Beverages", "Household"].map((cat) => (
              <Link
                key={cat}
                to={`/category/${encodeURIComponent(cat)}`}
                className="text-field-100/75 hover:text-mustard-400 font-medium transition-colors whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link to="/orders" className="text-field-100/75 hover:text-mustard-400 font-medium ml-auto">
                  Track Orders
                </Link>
                <Link to="/contact" className="text-field-100/75 hover:text-mustard-400 font-medium">
                  Your Complaints
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-b border-forest-900/10 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-700/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search groceries..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-field-50 border border-forest-900/10 text-sm"
                />
              </form>
              {["Fruits & Vegetables", "Dairy", "Bakery", "Beverages", "Household"].map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${encodeURIComponent(cat)}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-semibold text-forest-800"
                >
                  {cat}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-forest-800">
                    Track Orders
                  </Link>
                  <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-forest-800">
                    Your Complaints
                  </Link>
                </>
              )}
              <div className="pt-2 border-t border-forest-900/10">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="text-sm font-semibold text-coral-600">
                    Log out
                  </button>
                ) : (
                  <Link to="/login" className="block text-sm font-semibold text-leaf-600">
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
