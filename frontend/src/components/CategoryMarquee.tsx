const ITEMS = [
  { label: "Fruits & Vegetables", emoji: "🥦" },
  { label: "Dairy", emoji: "🧀" },
  { label: "Bakery", emoji: "🥐" },
  { label: "Beverages", emoji: "🧃" },
  { label: "Household", emoji: "🧽" },
  { label: "Spices", emoji: "🌶️" },
  { label: "Snacks", emoji: "🍿" },
  { label: "Frozen", emoji: "🧊" },
];

function CategoryMarquee() {
  const loopItems = [...ITEMS, ...ITEMS];

  return (
    <div className="bg-forest-900 py-3.5 overflow-hidden">
      <div className="flex w-max animate-marquee gap-10 px-5">
        {loopItems.map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-field-100/80 text-sm font-medium whitespace-nowrap">
            <span className="text-base">{item.emoji}</span>
            {item.label}
            <span className="text-leaf-500 ml-8">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default CategoryMarquee;
