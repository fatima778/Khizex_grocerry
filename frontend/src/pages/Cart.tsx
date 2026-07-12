import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import StorefrontLayout from "../layouts/StorefrontLayout";
import { useCartStore } from "../store/cartStore";
import ProductIllustration from "../components/ProductIllustration";

function Cart() {
  const { cart, isLoading, fetchCart, updateItem, removeItem } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const deliveryFee = subtotal > 0 ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;

  return (
    <StorefrontLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-bold text-forest-900 mb-8">Your basket</h1>

        {isLoading ? (
          <p className="text-forest-700/50">Loading your basket…</p>
        ) : items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-forest-900/5">
            <motion.p
              className="text-6xl mb-4 inline-block"
              animate={{ rotate: [0, -6, 6, -4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
            >
              🧺
            </motion.p>
            <p className="text-forest-900 font-semibold text-lg">Your basket is empty</p>
            <p className="text-forest-700/50 text-sm mt-1 mb-6">Add some fresh groceries to get started</p>
            <Link
              to="/"
              className="inline-block bg-forest-900 hover:bg-leaf-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, x: -30 }}
                    className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-forest-900/5"
                  >
                    <div className="w-16 h-16 rounded-xl bg-field-100 overflow-hidden shrink-0">
                      {item.product.images && item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="p-2.5 w-full h-full">
                          <ProductIllustration name={item.product.name} category={item.product.category} className="w-full h-full" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-forest-900 truncate">{item.product.name}</p>
                      <p className="text-sm text-forest-700/50">${item.product.price.toFixed(2)} / {item.product.unit}</p>
                    </div>
                    <div className="flex items-center border border-forest-900/10 rounded-full">
                      <button
                        onClick={() => updateItem(item.product._id, Math.max(1, item.quantity - 1))}
                        className="p-2 text-forest-700 hover:text-forest-900"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.product._id, item.quantity + 1)}
                        className="p-2 text-forest-700 hover:text-forest-900"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="w-16 text-right font-semibold text-forest-900 shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="p-2 text-forest-700/40 hover:text-coral-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-forest-900/5 h-fit sticky top-24">
              <h2 className="font-semibold text-forest-900 mb-4">Order summary</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-forest-700/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-forest-700/70">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-forest-700/70">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-forest-900 text-base pt-3 border-t border-forest-900/10">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-forest-900 hover:bg-leaf-600 text-white font-semibold py-3.5 rounded-full transition-colors"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}

export default Cart;
