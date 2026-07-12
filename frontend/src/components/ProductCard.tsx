import { Link, useNavigate } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Product } from "../types";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { categoryGradient } from "./categoryVisuals";
import { getProductRating } from "../utils/ratings";
import StarRating from "./StarRating";
import ProductIllustration from "./ProductIllustration";

interface ProductCardProps {
  product: Product;
  index?: number;
}

function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await addItem(product._id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.4), ease: "easeOut" }}
    >
      <Link
        to={`/products/${product._id}`}
        className="group block bg-white rounded-3xl overflow-hidden shadow-[0_1px_2px_rgba(18,36,26,0.06)] hover:shadow-[0_18px_36px_-16px_rgba(18,36,26,0.25)] transition-shadow duration-300 border border-forest-900/5"
      >
        <div className={`relative aspect-square bg-gradient-to-br ${categoryGradient(product.category)} overflow-hidden`}>
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 p-6 group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-sm">
              <ProductIllustration name={product.name} category={product.category} className="w-full h-full" />
            </div>
          )}

          {isOutOfStock && (
            <span className="absolute top-3 left-3 bg-forest-900/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              Out of stock
            </span>
          )}
          {isLowStock && (
            <span className="absolute top-3 left-3 bg-mustard-500 text-forest-900 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              Only {product.stock} left
            </span>
          )}

          <motion.button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            whileTap={{ scale: 0.9 }}
            className={`absolute bottom-3 right-3 rounded-full p-3 shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              justAdded ? "bg-leaf-600" : "bg-forest-900 hover:bg-leaf-600"
            } text-white`}
          >
            {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </motion.button>
        </div>

        <div className="p-4">
          <p className="text-[11px] uppercase tracking-wide text-forest-700/40 font-semibold mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-forest-900 truncate">{product.name}</h3>
          <div className="mt-1.5">
            <StarRating {...getProductRating(product._id)} />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-lg font-bold text-forest-900">${product.price.toFixed(2)}</span>
            <span className="text-xs text-forest-700/40">/ {product.unit}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
