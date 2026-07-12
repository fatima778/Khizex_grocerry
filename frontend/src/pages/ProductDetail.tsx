import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { getProductByIdApi } from "../api/products";
import type { Product } from "../types";
import StorefrontLayout from "../layouts/StorefrontLayout";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { categoryGradient } from "../components/categoryVisuals";
import ProductIllustration from "../components/ProductIllustration";
import { useTilt } from "../hooks/useTilt";
import { getProductRating } from "../utils/ratings";
import StarRating from "../components/StarRating";

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const tilt = useTilt(8);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProductByIdApi(id)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleAdd() {
    if (!product) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await addItem(product._id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-forest-700/50">Loading product…</div>
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <p className="text-5xl mb-4">🥕</p>
          <p className="text-forest-900 font-semibold text-lg">We couldn't find that product</p>
          <Link to="/" className="text-leaf-600 font-medium text-sm mt-2 inline-block">Back to shop</Link>
        </div>
      </StorefrontLayout>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <StorefrontLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-forest-700/60 hover:text-forest-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <div
            ref={tilt.ref}
            onMouseMove={tilt.handleMouseMove}
            onMouseLeave={tilt.handleMouseLeave}
            style={{ transition: "transform 0.15s ease-out" }}
            className={`aspect-square rounded-[2rem] bg-gradient-to-br ${categoryGradient(product.category)} ${
              product.images?.[0] ? "" : "p-14"
            } shadow-xl border border-forest-900/5 overflow-hidden`}
          >
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <ProductIllustration name={product.name} category={product.category} className="w-full h-full" />
            )}
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-600">{product.category}</span>
            <h1 className="font-display text-4xl font-bold text-forest-900 mt-2 mb-2">{product.name}</h1>
            <div className="mb-3">
              <StarRating {...getProductRating(product._id)} size="md" />
            </div>
            <p className="text-forest-700/70 mb-6">{product.description}</p>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-forest-900">${product.price.toFixed(2)}</span>
              <span className="text-sm text-forest-700/40">/ {product.unit}</span>
            </div>

            <div className="mb-6">
              {isOutOfStock ? (
                <span className="inline-block bg-forest-900/85 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  Out of stock
                </span>
              ) : product.stock <= product.lowStockThreshold ? (
                <span className="inline-block bg-mustard-500 text-forest-900 text-xs font-semibold px-3 py-1.5 rounded-full">
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="inline-block bg-leaf-500/15 text-leaf-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  In stock
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-forest-900/10 rounded-full bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 text-forest-700 hover:text-forest-900"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="p-3 text-forest-700 hover:text-forest-900"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <motion.button
                onClick={handleAdd}
                disabled={isOutOfStock}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 font-semibold px-6 py-3.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-white ${
                  added ? "bg-leaf-600" : "bg-forest-900 hover:bg-leaf-600"
                }`}
              >
                {added ? "Added to cart ✓" : "Add to cart"}
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-forest-900/10">
              <div className="flex items-center gap-2 text-sm text-forest-700/70">
                <Truck className="w-4 h-4 text-leaf-600" /> Same-day delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-forest-700/70">
                <ShieldCheck className="w-4 h-4 text-leaf-600" /> Secure test-mode checkout
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

export default ProductDetail;
