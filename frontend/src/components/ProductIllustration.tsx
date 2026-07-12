/**
 * Per-product illustrated artwork. Since reliable, license-safe product
 * photography isn't available to embed here, every item gets a distinct,
 * hand-built vector illustration (not a generic emoji) so each product
 * visually reads as itself — a red apple looks like an apple, a milk
 * carton looks like a carton, etc. Swap in real photos later by replacing
 * this component's output with an <img> per product if/when you have
 * licensed photography.
 */

type ShapeType =
  | "round-fruit" | "citrus" | "leafy" | "root-veg" | "elongated-veg" | "pepper"
  | "grape-cluster" | "avocado" | "carton" | "cup" | "cheese-wedge" | "egg-cluster"
  | "butter-block" | "cheese-ball" | "bread-loaf" | "croissant" | "bagel-ring" | "muffin"
  | "bottle" | "can" | "coffee-bag" | "spray-bottle" | "paper-roll" | "tea-box";

interface IllustrationConfig {
  shape: ShapeType;
  color: string;
  accent?: string;
}

const PRODUCT_MAP: Record<string, IllustrationConfig> = {
  "Fresh Bananas": { shape: "elongated-veg", color: "#F2C94C", accent: "#8A6D1D" },
  "Roma Tomatoes": { shape: "round-fruit", color: "#D6391F", accent: "#4C9A2A" },
  "Baby Spinach": { shape: "leafy", color: "#3D7E22", accent: "#4C9A2A" },
  "Avocados": { shape: "avocado", color: "#5B7A3A", accent: "#C9B27C" },
  "Red Bell Peppers": { shape: "pepper", color: "#D6391F", accent: "#3D7E22" },
  "Green Grapes": { shape: "grape-cluster", color: "#93C13D", accent: "#4C9A2A" },
  "Carrots": { shape: "root-veg", color: "#EF8A2C", accent: "#3D7E22" },
  "Red Apples": { shape: "round-fruit", color: "#C62E27", accent: "#3D7E22" },
  "Cucumbers": { shape: "elongated-veg", color: "#4C9A2A", accent: "#2C5233" },
  "Oranges": { shape: "citrus", color: "#F0972B", accent: "#3D7E22" },
  "Whole Milk": { shape: "carton", color: "#FFFFFF", accent: "#3B82C4" },
  "Greek Yogurt": { shape: "cup", color: "#FFFFFF", accent: "#F0972B" },
  "Cheddar Cheese": { shape: "cheese-wedge", color: "#F0B429", accent: "#D6391F" },
  "Free-Range Eggs": { shape: "egg-cluster", color: "#F3E3C3", accent: "#8A5A34" },
  "Butter": { shape: "butter-block", color: "#F5D77A", accent: "#8A5A34" },
  "Mozzarella": { shape: "cheese-ball", color: "#FBF7EF", accent: "#93C13D" },
  "Sourdough Loaf": { shape: "bread-loaf", color: "#C68642", accent: "#8A5A34" },
  "Croissants": { shape: "croissant", color: "#E8A94C", accent: "#8A5A34" },
  "Whole Wheat Bread": { shape: "bread-loaf", color: "#A9764A", accent: "#6E4A2E" },
  "Bagels": { shape: "bagel-ring", color: "#C68642", accent: "#8A5A34" },
  "Chocolate Muffins": { shape: "muffin", color: "#6E4A2E", accent: "#F5D77A" },
  "Orange Juice": { shape: "bottle", color: "#F0972B", accent: "#3B82C4" },
  "Sparkling Water": { shape: "bottle", color: "#3B82C4", accent: "#FFFFFF" },
  "Green Tea Bags": { shape: "tea-box", color: "#3D7E22", accent: "#F5D77A" },
  "Cola Bottles": { shape: "can", color: "#C62E27", accent: "#F3E3C3" },
  "Coffee Beans": { shape: "coffee-bag", color: "#5B3A22", accent: "#F0972B" },
  "Dish Soap": { shape: "bottle", color: "#F0B429", accent: "#3D7E22" },
  "Paper Towels": { shape: "paper-roll", color: "#FFFFFF", accent: "#3B82C4" },
  "Laundry Detergent": { shape: "bottle", color: "#3B82C4", accent: "#F0B429" },
  "Toilet Paper": { shape: "paper-roll", color: "#FFFFFF", accent: "#93C13D" },
  "All-Purpose Cleaner": { shape: "spray-bottle", color: "#3B82C4", accent: "#FFFFFF" },
};

const CATEGORY_FALLBACK: Record<string, IllustrationConfig> = {
  "Fruits & Vegetables": { shape: "round-fruit", color: "#93C13D", accent: "#3D7E22" },
  "Dairy": { shape: "carton", color: "#FFFFFF", accent: "#3B82C4" },
  "Bakery": { shape: "bread-loaf", color: "#C68642", accent: "#8A5A34" },
  "Beverages": { shape: "bottle", color: "#F0972B", accent: "#3B82C4" },
  "Household": { shape: "spray-bottle", color: "#3B82C4", accent: "#F0B429" },
};

function getConfig(name: string, category: string): IllustrationConfig {
  return PRODUCT_MAP[name] || CATEGORY_FALLBACK[category] || { shape: "round-fruit", color: "#93C13D" };
}

function Shape({ shape, color, accent }: IllustrationConfig) {
  const stroke = "rgba(18,36,26,0.12)";

  switch (shape) {
    case "round-fruit":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="56" rx="30" ry="28" fill={color} stroke={stroke} strokeWidth="1" />
          <ellipse cx="40" cy="46" rx="9" ry="6" fill="#fff" opacity="0.35" />
          <rect x="47" y="22" width="5" height="14" rx="2.5" fill="#6E4A2E" transform="rotate(-12 49 29)" />
          <ellipse cx="60" cy="24" rx="9" ry="6" fill={accent || "#3D7E22"} transform="rotate(35 60 24)" />
        </svg>
      );
    case "citrus":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="54" r="29" fill={color} stroke={stroke} strokeWidth="1" />
          <circle cx="50" cy="54" r="29" fill="none" stroke="#ffffff30" strokeWidth="6" strokeDasharray="2 6" />
          <ellipse cx="40" cy="44" rx="8" ry="5" fill="#fff" opacity="0.3" />
          <ellipse cx="50" cy="24" rx="6" ry="4" fill={accent || "#3D7E22"} />
        </svg>
      );
    case "leafy":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {[[-18, 8], [0, -4], [18, 8], [-10, 24], [10, 24]].map(([dx, dy], i) => (
            <path
              key={i}
              d={`M50 60 Q${50 + dx * 1.6} ${52 + dy} ${50 + dx * 2.2} ${34 + dy} Q${50 + dx * 1.2} ${52 + dy} 50 60 Z`}
              fill={i % 2 === 0 ? color : accent}
              opacity="0.92"
            />
          ))}
          <rect x="47" y="58" width="6" height="16" rx="3" fill="#6E4A2E" />
        </svg>
      );
    case "root-veg":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M38 30 Q50 20 62 30 L58 78 Q50 88 42 78 Z" fill={color} stroke={stroke} strokeWidth="1" />
          <path d="M46 30 L44 16 M50 28 L50 12 M54 30 L56 16" stroke={accent || "#3D7E22"} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "elongated-veg":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M28 62 Q30 30 55 22 Q78 16 74 34 Q68 60 44 72 Q30 78 28 62 Z"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
          <path d="M55 22 Q60 26 58 32" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "pepper":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50 30 C30 34 26 55 34 72 C40 84 60 84 66 72 C74 55 70 34 50 30 Z"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
          <path d="M50 30 L48 18 Q50 12 56 16 L58 24" fill={accent || "#3D7E22"} />
        </svg>
      );
    case "grape-cluster":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {[
            [50, 34], [40, 46], [60, 46], [32, 58], [50, 58], [68, 58],
            [40, 70], [60, 70], [50, 82],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="9" fill={color} stroke={stroke} strokeWidth="0.6" />
          ))}
          <path d="M50 34 L50 18" stroke={accent || "#3D7E22"} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "avocado":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 20 C68 20 76 42 72 60 C68 82 32 82 28 60 C24 42 32 20 50 20 Z" fill={color} stroke={stroke} strokeWidth="1" />
          <ellipse cx="50" cy="58" rx="13" ry="14" fill={accent || "#C9B27C"} />
          <circle cx="50" cy="58" r="6" fill="#6E4A2E" />
        </svg>
      );
    case "carton":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M30 30 L70 30 L70 82 L30 82 Z" fill={color} stroke={stroke} strokeWidth="1.2" />
          <path d="M30 30 L50 18 L70 30" fill={color} stroke={stroke} strokeWidth="1.2" />
          <rect x="30" y="46" width="40" height="14" fill={accent || "#3B82C4"} opacity="0.85" />
        </svg>
      );
    case "cup":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M34 40 L66 40 L61 82 L39 82 Z" fill={color} stroke={stroke} strokeWidth="1.2" />
          <ellipse cx="50" cy="40" rx="16" ry="5" fill={accent || "#F0972B"} opacity="0.9" />
        </svg>
      );
    case "cheese-wedge":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M24 74 L70 30 L82 70 Z" fill={color} stroke={stroke} strokeWidth="1.2" />
          <circle cx="45" cy="60" r="3" fill={accent || "#D6391F"} opacity="0.6" />
          <circle cx="60" cy="50" r="2.5" fill={accent || "#D6391F"} opacity="0.6" />
          <circle cx="55" cy="65" r="2" fill={accent || "#D6391F"} opacity="0.6" />
        </svg>
      );
    case "egg-cluster":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="38" cy="60" rx="14" ry="18" fill={color} stroke={stroke} strokeWidth="1" />
          <ellipse cx="62" cy="56" rx="14" ry="18" fill={color} stroke={stroke} strokeWidth="1" />
          <ellipse cx="50" cy="70" rx="14" ry="18" fill={accent || "#F3E3C3"} stroke={stroke} strokeWidth="1" />
        </svg>
      );
    case "butter-block":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="26" y="38" width="48" height="34" rx="3" fill={color} stroke={stroke} strokeWidth="1.2" />
          <rect x="26" y="38" width="48" height="10" fill={accent || "#8A5A34"} opacity="0.85" />
        </svg>
      );
    case "cheese-ball":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="56" r="26" fill={color} stroke={stroke} strokeWidth="1.2" />
          <path d="M28 56 Q50 68 72 56" stroke={accent || "#93C13D"} strokeWidth="2" fill="none" opacity="0.6" />
        </svg>
      );
    case "bread-loaf":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M22 70 Q22 34 50 30 Q78 34 78 70 Z" fill={color} stroke={stroke} strokeWidth="1.2" />
          <path d="M32 44 Q50 38 68 44 M30 54 Q50 47 70 54" stroke={accent || "#8A5A34"} strokeWidth="2.5" fill="none" opacity="0.7" strokeLinecap="round" />
        </svg>
      );
    case "croissant":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M20 66 Q30 30 55 28 Q80 28 78 50 Q66 44 58 52 Q68 56 66 68 Q50 60 44 68 Q52 74 44 78 Q28 80 20 66 Z"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
        </svg>
      );
    case "bagel-ring":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="54" r="28" fill={color} stroke={stroke} strokeWidth="1.2" />
          <circle cx="50" cy="54" r="11" fill="#FBF7EF" />
          {[[38, 34], [64, 40], [58, 70]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.6" fill={accent || "#8A5A34"} />
          ))}
        </svg>
      );
    case "muffin":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M30 56 L70 56 L64 82 L36 82 Z" fill="#E8D3A5" stroke={stroke} strokeWidth="1" />
          <path d="M26 56 Q50 32 74 56 Q60 46 50 48 Q40 46 26 56 Z" fill={color} stroke={stroke} strokeWidth="1" />
          {[[40, 42], [50, 38], [60, 44]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2" fill={accent || "#F5D77A"} />
          ))}
        </svg>
      );
    case "bottle":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="40" y="18" width="20" height="14" rx="3" fill={accent || "#3B82C4"} />
          <path d="M38 32 L62 32 L68 46 L68 82 Q68 86 64 86 L36 86 Q32 86 32 82 L32 46 Z" fill={color} stroke={stroke} strokeWidth="1.2" />
          <rect x="32" y="52" width="36" height="14" fill="#ffffff35" />
        </svg>
      );
    case "can":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="32" y="26" width="36" height="56" rx="6" fill={color} stroke={stroke} strokeWidth="1.2" />
          <rect x="32" y="26" width="36" height="10" rx="3" fill={accent || "#F3E3C3"} />
          <rect x="32" y="72" width="36" height="10" rx="3" fill={accent || "#F3E3C3"} opacity="0.7" />
        </svg>
      );
    case "coffee-bag":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M30 34 L70 34 L66 82 L34 82 Z" fill={color} stroke={stroke} strokeWidth="1.2" />
          <path d="M30 34 Q50 24 70 34" fill="none" stroke={stroke} strokeWidth="1.2" />
          <rect x="42" y="44" width="16" height="20" rx="2" fill={accent || "#F0972B"} opacity="0.85" />
        </svg>
      );
    case "spray-bottle":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="38" y="40" width="24" height="42" rx="4" fill={color} stroke={stroke} strokeWidth="1.2" />
          <rect x="44" y="26" width="12" height="16" fill="#9CA3AF" />
          <path d="M56 30 L70 22" stroke="#6b7280" strokeWidth="4" strokeLinecap="round" />
          <rect x="42" y="52" width="16" height="12" fill={accent || "#FFFFFF"} opacity="0.6" />
        </svg>
      );
    case "paper-roll":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="30" y="24" width="40" height="56" rx="20" fill={color} stroke={stroke} strokeWidth="1.2" />
          <ellipse cx="50" cy="24" rx="20" ry="8" fill={accent || "#3B82C4"} opacity="0.8" />
          <ellipse cx="50" cy="24" rx="9" ry="4" fill="#fff" />
        </svg>
      );
    case "tea-box":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="30" y="28" width="40" height="52" rx="3" fill={color} stroke={stroke} strokeWidth="1.2" />
          <rect x="30" y="28" width="40" height="14" fill={accent || "#F5D77A"} />
          <circle cx="50" cy="60" r="9" fill="#ffffff30" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="54" r="28" fill={color} />
        </svg>
      );
  }
}

interface ProductIllustrationProps {
  name: string;
  category: string;
  className?: string;
}

function ProductIllustration({ name, category, className = "" }: ProductIllustrationProps) {
  const config = getConfig(name, category);
  return (
    <div className={className}>
      <Shape {...config} />
    </div>
  );
}

export default ProductIllustration;
