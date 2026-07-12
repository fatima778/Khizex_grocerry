import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Truck, ShieldCheck } from "lucide-react";
import { getProductsApi } from "../api/products";
import type { Product } from "../types";
import StorefrontLayout from "../layouts/StorefrontLayout";
import HeroCarousel from "../components/HeroCarousel";
import CategoryMarquee from "../components/CategoryMarquee";
import ProductCard from "../components/ProductCard";
import Photo3DShowcase from "../components/Photo3DShowcase";
import Testimonials from "../components/Testimonials";
import ContactCTA from "../components/ContactCTA";

const CATEGORIES = ["Fruits & Vegetables", "Dairy", "Bakery", "Beverages", "Household"];
const PER_CATEGORY = 8;

function Home() {
  const [byCategory, setByCategory] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setIsLoading(true);
    const results = await Promise.all(
      CATEGORIES.map((cat) => getProductsApi({ category: cat, limit: PER_CATEGORY, sort: "newest" }))
    );
    const map: Record<string, Product[]> = {};
    CATEGORIES.forEach((cat, i) => {
      map[cat] = results[i].data.products;
    });
    setByCategory(map);
    setIsLoading(false);
  }

  return (
    <StorefrontLayout>
      <HeroCarousel />
      <CategoryMarquee />

      <div id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-16">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse border border-forest-900/5">
                <div className="aspect-square bg-forest-900/5" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-forest-900/10 rounded w-1/2" />
                  <div className="h-4 bg-forest-900/10 rounded w-3/4" />
                  <div className="h-4 bg-forest-900/10 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          CATEGORIES.map((cat) => {
            const products = byCategory[cat] || [];
            if (products.length === 0) return null;
            return (
              <section key={cat}>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-leaf-600">Category</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-900 mt-1">{cat}</h2>
                  </div>
                  <Link
                    to={`/category/${encodeURIComponent(cat)}`}
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-700 hover:text-leaf-800"
                  >
                    Explore more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {products.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </div>

                <Link
                  to={`/category/${encodeURIComponent(cat)}`}
                  className="sm:hidden mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-700"
                >
                  Explore more in {cat} <ArrowRight className="w-4 h-4" />
                </Link>
              </section>
            );
          })
        )}

        <section className="bg-white rounded-[2.5rem] border border-forest-900/5 overflow-hidden">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-12">
              <span className="text-xs font-bold uppercase tracking-widest text-leaf-600">Why Khizex</span>
              <h2 className="font-display text-3xl font-bold text-forest-900 mt-2 mb-4">
                Sourced fresh, tracked live, delivered fast.
              </h2>
              <p className="text-forest-700/70 mb-8 max-w-md">
                Every order is backed by real-time stock accuracy and same-day delivery —
                the way grocery shopping should feel.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-sm">
                {[
                  { icon: Leaf, label: "Farm direct" },
                  { icon: Truck, label: "Same-day delivery" },
                  { icon: ShieldCheck, label: "Secure checkout" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1.5">
                    <Icon className="w-5 h-5 text-leaf-600" />
                    <span className="text-[11px] font-medium text-forest-700/60 leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-72 sm:h-96">
              <Photo3DShowcase />
            </div>
          </div>
        </section>
      </div>

      <Testimonials />
      <ContactCTA />
    </StorefrontLayout>
  );
}

export default Home;
