export const CATEGORY_EMOJI: Record<string, string> = {
  "Fruits & Vegetables": "🥬",
  "Dairy": "🥛",
  "Bakery": "🍞",
  "Beverages": "🧃",
  "Household": "🧺",
};

export const CATEGORY_GRADIENT: Record<string, string> = {
  "Fruits & Vegetables": "from-leaf-400/25 to-leaf-600/10",
  "Dairy": "from-sky-300/25 to-sky-500/10",
  "Bakery": "from-mustard-400/30 to-coral-500/10",
  "Beverages": "from-coral-400/25 to-coral-600/10",
  "Household": "from-forest-400/20 to-forest-700/10",
};

export function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] || "🛒";
}

export function categoryGradient(category: string): string {
  return CATEGORY_GRADIENT[category] || "from-leaf-400/20 to-leaf-600/10";
}
