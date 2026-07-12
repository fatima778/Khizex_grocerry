import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import StorefrontLayout from "../layouts/StorefrontLayout";
import { useCartStore } from "../store/cartStore";
import { checkoutApi } from "../api/orders";

function Checkout() {
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const deliveryFee = subtotal > 0 ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await checkoutApi({ address, cardNumber: cardNumber.replace(/\s/g, "") });
      navigate(`/orders?confirmed=${res.data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <StorefrontLayout>
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <p className="text-5xl mb-4">🧺</p>
          <p className="text-forest-900 font-semibold text-lg">Your basket is empty</p>
          <p className="text-forest-700/50 text-sm mt-1">Add items before checking out</p>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-bold text-forest-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white rounded-2xl p-6 border border-forest-900/5 space-y-5">
            <div>
              <h2 className="font-semibold text-forest-900 mb-3">Delivery address</h2>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="House no, street, city"
                className="w-full px-4 py-3 rounded-xl border border-forest-900/10 focus:outline-none focus:ring-2 focus:ring-leaf-400 text-sm"
              />
            </div>

            <div>
              <h2 className="font-semibold text-forest-900 mb-3 flex items-center gap-2">
                Payment details <Lock className="w-3.5 h-3.5 text-forest-700/40" />
              </h2>
              <p className="text-xs text-forest-700/50 mb-3">
                Sandbox test mode — use <span className="font-mono">4242 4242 4242 4242</span> for a successful
                payment, or <span className="font-mono">4000 0000 0000 0002</span> to simulate a decline. No real
                card data is stored.
              </p>
              <input
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card number"
                maxLength={19}
                className="w-full px-4 py-3 rounded-xl border border-forest-900/10 focus:outline-none focus:ring-2 focus:ring-leaf-400 text-sm mb-3 font-mono"
              />
              <div className="flex gap-3">
                <input
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-1/2 px-4 py-3 rounded-xl border border-forest-900/10 focus:outline-none focus:ring-2 focus:ring-leaf-400 text-sm"
                />
                <input
                  required
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="CVC"
                  className="w-1/2 px-4 py-3 rounded-xl border border-forest-900/10 focus:outline-none focus:ring-2 focus:ring-leaf-400 text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-coral-50 text-coral-600 text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-forest-900 hover:bg-leaf-600 text-white font-semibold py-3.5 rounded-full transition-colors disabled:opacity-50"
            >
              {isLoading ? "Processing payment…" : `Pay $${total.toFixed(2)}`}
            </button>
          </form>

          <div className="lg:col-span-2 bg-field-100/60 rounded-2xl p-6 h-fit">
            <h2 className="font-semibold text-forest-900 mb-4">Order summary</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between text-sm">
                  <span className="text-forest-700/70">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-forest-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-forest-900/10 pt-3">
              <div className="flex justify-between text-forest-700/70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-forest-700/70">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-forest-700/70">
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-forest-900 text-base pt-2 border-t border-forest-900/10">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

export default Checkout;
