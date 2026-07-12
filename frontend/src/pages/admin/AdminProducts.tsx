import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from "../../api/products";
import type { ProductInput } from "../../api/products";
import type { Product } from "../../types";
import ProductIllustration from "../../components/ProductIllustration";

const CATEGORIES = ["Fruits & Vegetables", "Dairy", "Bakery", "Beverages", "Household"];
const UNITS = ["kg", "lb", "pack", "each"] as const;

const EMPTY_FORM: ProductInput = {
  name: "",
  description: "",
  price: 0,
  unit: "each",
  category: CATEGORIES[0],
  stock: 0,
  lowStockThreshold: 10,
  images: [],
};

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    const res = await getProductsApi({ limit: 100 });
    setProducts(res.data.products);
    setIsLoading(false);
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      category: product.category,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      images: product.images || [],
    });
    setEditingId(product._id);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateProductApi(editingId, form);
      } else {
        await createProductApi(form);
      }
      setShowForm(false);
      loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await deleteProductApi(id);
    loadProducts();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">Products</h1>
          <p className="text-forest-700/50 text-sm mt-1">Manage catalog, pricing and stock</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-forest-900 hover:bg-leaf-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-forest-900/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-forest-700/50 border-b border-forest-900/5">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-forest-700/40">Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-forest-700/40">No products yet — add your first one.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-b border-forest-900/5 last:border-0">
                  <td className="px-5 py-3 flex items-center gap-3">
                    <span className="w-8 h-8 shrink-0"><ProductIllustration name={p.name} category={p.category} className="w-full h-full" /></span>
                    <span className="font-medium text-forest-900">{p.name}</span>
                  </td>
                  <td className="px-5 py-3 text-forest-700/60">{p.category}</td>
                  <td className="px-5 py-3 text-forest-900 font-medium">${p.price.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={p.stock === 0 ? "text-coral-600 font-medium" : p.stock <= p.lowStockThreshold ? "text-mustard-600 font-medium" : "text-forest-700/70"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(p)} className="p-2 hover:bg-forest-900/5 rounded-lg">
                        <Pencil className="w-4 h-4 text-forest-700/60" />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-coral-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-coral-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-forest-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-bold text-forest-900">
                  {editingId ? "Edit product" : "Add product"}
                </h2>
                <button type="button" onClick={() => setShowForm(false)} className="p-1.5 hover:bg-forest-900/5 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && <div className="bg-coral-50 text-coral-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

              <div className="space-y-3">
                <input
                  required
                  placeholder="Product name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value as ProductInput["unit"] })}
                    className="px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                  >
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price"
                    value={form.price || ""}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                  />
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="Stock"
                    value={form.stock || ""}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Low stock at"
                    value={form.lowStockThreshold || ""}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
                    className="px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                  />
                </div>

                <div>
                  <input
                    type="url"
                    placeholder="Image URL (paste any product photo link)"
                    value={form.images?.[0] || ""}
                    onChange={(e) => setForm({ ...form, images: e.target.value ? [e.target.value] : [] })}
                    className="w-full px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                  />
                  <p className="text-xs text-forest-700/40 mt-1">
                    Paste a direct image link (e.g. from Google Images "copy image address"). Leave blank to use a placeholder.
                  </p>
                  {form.images?.[0] && (
                    <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-forest-900/10">
                      <img
                        src={form.images[0]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.opacity = "0.2";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-5 bg-forest-900 hover:bg-leaf-600 text-white font-semibold py-3 rounded-full transition-colors"
              >
                {editingId ? "Save changes" : "Create product"}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

export default AdminProducts;
