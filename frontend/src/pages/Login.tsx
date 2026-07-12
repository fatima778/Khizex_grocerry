import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { loginApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import AuthShowcasePanel from "../components/AuthShowcasePanel";

function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [loginAs, setLoginAs] = useState<"customer" | "admin">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await loginApi({ email, password });

      if (res.data.user.role !== loginAs) {
        setError(
          loginAs === "admin"
            ? "This account isn't registered as Admin/Staff. Try the Customer tab instead."
            : "This is an Admin/Staff account. Switch to the Admin/Staff tab to log in."
        );
        setIsLoading(false);
        return;
      }

      setAuth(res.data.user, res.data.accessToken);
      navigate(res.data.user.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-field-50">
      <AuthShowcasePanel />

      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <h1 className="font-display text-3xl font-bold text-forest-900 mb-2">Welcome back</h1>
          <p className="text-forest-700/60 mb-6">Log in to keep filling your basket</p>

          <div className="grid grid-cols-2 gap-2 mb-6 bg-forest-900/5 p-1 rounded-full">
            <button
              type="button"
              onClick={() => {
                setLoginAs("customer");
                setError("");
              }}
              className={`py-2 rounded-full text-sm font-semibold transition-colors ${
                loginAs === "customer" ? "bg-white text-forest-900 shadow-sm" : "text-forest-700/50"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginAs("admin");
                setError("");
              }}
              className={`py-2 rounded-full text-sm font-semibold transition-colors ${
                loginAs === "admin" ? "bg-white text-forest-900 shadow-sm" : "text-forest-700/50"
              }`}
            >
              Admin / Staff
            </button>
          </div>

          {error && (
            <div className="bg-coral-50 text-coral-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-800 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-forest-900/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-800 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-forest-900/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-forest-900 hover:bg-leaf-600 text-white font-semibold py-3.5 rounded-full transition-colors disabled:opacity-50"
            >
              {isLoading ? "Logging in…" : loginAs === "admin" ? "Log in to dashboard" : "Log in"}
            </button>
          </form>

          {loginAs === "customer" ? (
            <p className="text-center text-sm text-forest-700/50 mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-leaf-600 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-center text-sm text-forest-700/40 mt-6">
              Admin and staff accounts are created by your store administrator — not self-registered.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
