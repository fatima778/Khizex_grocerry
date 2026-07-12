import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { signupApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import AuthShowcasePanel from "../components/AuthShowcasePanel";

function Signup() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await signupApi({ name, email, password });
      setAuth(res.data.user, res.data.accessToken);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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
          <h1 className="font-display text-3xl font-bold text-forest-900 mb-2">Create your account</h1>
          <p className="text-forest-700/60 mb-8">Fresh groceries are a few taps away</p>

          {error && (
            <div className="bg-coral-50 text-coral-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-800 mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-forest-900/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-400"
                placeholder="Fatima Khalid"
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-forest-900/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-400"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-forest-900 hover:bg-leaf-600 text-white font-semibold py-3.5 rounded-full transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="text-center text-sm text-forest-700/50 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-leaf-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
