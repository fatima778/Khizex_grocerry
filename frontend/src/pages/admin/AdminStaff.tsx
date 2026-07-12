import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, ShieldCheck } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { listStaffApi, createStaffApi, removeStaffApi } from "../../api/staff";
import type { User } from "../../types";
import { useAuthStore } from "../../store/authStore";

function AdminStaff() {
  const currentUser = useAuthStore((state) => state.user);
  const [staff, setStaff] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    setIsLoading(true);
    const res = await listStaffApi();
    setStaff(res.data);
    setIsLoading(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createStaffApi({ name, email, password });
      setShowForm(false);
      setName("");
      setEmail("");
      setPassword("");
      loadStaff();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create staff account");
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Revoke this admin's access? They'll become a regular customer account.")) return;
    await removeStaffApi(id);
    loadStaff();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">Staff & Admins</h1>
          <p className="text-forest-700/50 text-sm mt-1">
            Onboard new store staff directly — no server access needed
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-forest-900 hover:bg-leaf-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          <Plus className="w-4 h-4" /> Add staff
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-forest-900/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-forest-700/50 border-b border-forest-900/5">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-forest-700/40">Loading…</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-forest-700/40">No staff accounts yet</td></tr>
            ) : (
              staff.map((s) => (
                <tr key={s.id} className="border-b border-forest-900/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-forest-900">
                    {s.name} {s.id === currentUser?.id && <span className="text-xs text-forest-700/40">(you)</span>}
                  </td>
                  <td className="px-5 py-3 text-forest-700/60">{s.email}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-leaf-500/10 text-leaf-700">
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {s.id !== currentUser?.id && (
                      <button onClick={() => handleRemove(s.id)} className="p-2 hover:bg-coral-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-coral-500" />
                      </button>
                    )}
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
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-bold text-forest-900">Add staff member</h2>
                <button type="button" onClick={() => setShowForm(false)} className="p-1.5 hover:bg-forest-900/5 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && <div className="bg-coral-50 text-coral-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

              <div className="space-y-3">
                <input
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                />
                <input
                  required
                  type="password"
                  minLength={6}
                  placeholder="Temporary password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                />
              </div>

              <p className="text-xs text-forest-700/50 mt-3">
                This account will have full admin access immediately. Share the password with them securely.
              </p>

              <button
                type="submit"
                className="w-full mt-5 bg-forest-900 hover:bg-leaf-600 text-white font-semibold py-3 rounded-full transition-colors"
              >
                Create staff account
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

export default AdminStaff;
