import { motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react";

function AuthShowcasePanel() {
  return (
    <div className="hidden lg:flex relative flex-col justify-between bg-forest-900 text-field-50 p-12 overflow-hidden">
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-leaf-500/10 blur-3xl animate-float-slow" />
      <div className="absolute bottom-0 -left-10 w-64 h-64 rounded-full bg-coral-500/10 blur-3xl animate-float-slower" />

      <div className="relative z-10 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-leaf-500 flex items-center justify-center">
          <ShoppingBasket className="w-4 h-4 text-forest-900" />
        </div>
        <span className="font-display text-lg font-bold">Khizex.</span>
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold leading-tight mb-4">
            Groceries picked fresh,
            <br /> delivered the same day.
          </h2>
          <p className="text-field-100/60 text-sm max-w-sm">
            Join thousands of shoppers who ditched crowded aisles for a basket that
            fills itself in minutes.
          </p>
        </motion.div>

        <div className="flex gap-3 mt-8">
          {["🍓", "🥑", "🥖", "🧃"].map((e, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 * i, type: "spring" }}
              className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl"
            >
              {e}
            </motion.span>
          ))}
        </div>
      </div>

      <p className="relative z-10 text-xs text-field-100/30">© 2026 Khizex Grocery</p>
    </div>
  );
}

export default AuthShowcasePanel;
