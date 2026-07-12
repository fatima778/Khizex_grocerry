import { motion } from "framer-motion";

interface CategoryGridProps {
  active: string;
  onSelect: (category: string) => void;
}

const CATEGORIES = [
  { label: "All", emoji: "🛒", gradient: "from-forest-400/15 to-forest-700/5" },
  { label: "Fruits & Vegetables", emoji: "🥬", gradient: "from-leaf-400/25 to-leaf-600/10" },
  { label: "Dairy", emoji: "🥛", gradient: "from-sky-300/25 to-sky-500/10" },
  { label: "Bakery", emoji: "🍞", gradient: "from-mustard-400/30 to-coral-500/10" },
  { label: "Beverages", emoji: "🧃", gradient: "from-coral-400/25 to-coral-600/10" },
  { label: "Household", emoji: "🧺", gradient: "from-forest-400/20 to-forest-700/10" },
];

function CategoryGrid({ active, onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.label;
        return (
          <motion.button
            key={cat.label}
            onClick={() => onSelect(cat.label)}
            whileHover={{ y: -4, rotate: -1 }}
            whileTap={{ scale: 0.96 }}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${cat.gradient} border transition-colors ${
              isActive ? "border-forest-900/40 ring-2 ring-forest-900/10" : "border-forest-900/5"
            }`}
          >
            <span className="text-2xl sm:text-3xl">{cat.emoji}</span>
            <span className="text-[11px] sm:text-xs font-semibold text-forest-900 text-center leading-tight">
              {cat.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default CategoryGrid;
