import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getProductsApi } from "../api/products";
import type { Product } from "../types";
import StorefrontLayout from "../layouts/StorefrontLayout";
import ProductCard from "../components/ProductCard";

const LIMIT = 16;

function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const category = decodeURIComponent(name || "");

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setProducts([]);
    setPage(1);
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort]);

  async function loadPage(pageNum: number, replace = false) {
    if (replace) setIsLoading(true);
    else setIsLoadingMore(true);

    const res = await getProductsApi({ category, page: pageNum, limit: LIMIT, sort });
    setProducts((prev) => (replace ? res.data.products : [...prev, ...res.data.products]));
    setTotalPages(res.data.pagination.pages);
    setTotal(res.data.pagination.total);
    setPage(pageNum);
    setIsLoading(false);
    setIsLoadingMore(false);
  }

  const hasMore = page < totalPages;

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-forest-700/60 hover:text-forest-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-600">Category</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 mt-1">{category}</h1>
            <p className="text-forest-700/50 text-sm mt-1">{total} products available</p>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-full bg-white border border-forest-900/10 focus:outline-none focus:ring-2 focus:ring-leaf-400 text-sm w-fit"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse border border-forest-900/5">
                <div className="aspect-square bg-forest-900/5" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-forest-900/10 rounded w-1/2" />
                  <div className="h-4 bg-forest-900/10 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-forest-900/5">
            <p className="text-5xl mb-4">🧺</p>
            <p className="text-forest-900 font-semibold text-lg">No products in this category yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i % LIMIT} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => loadPage(page + 1)}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 bg-forest-900 hover:bg-leaf-600 text-white font-semibold px-7 py-3 rounded-full transition-colors disabled:opacity-60"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                    </>
                  ) : (
                    "Load more products"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </StorefrontLayout>
  );
}

export default CategoryPage;
