import { useEffect, useRef, useState } from "react";

interface ShowcaseItem {
  src: string;
  label: string;
}

const ITEMS: ShowcaseItem[] = [
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcm-2CzSK_prBSxqAhq-yQDwldYeSTlYEdjv3JzM9-iQ&s=10", label: "Fresh Apples" },
  { src: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600", label: "Ripe Tomatoes" },
  { src: "https://images.pexels.com/photos/23042/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600", label: "Sweet Grapes" },
  { src: "https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg?auto=compress&cs=tinysrgb&w=600", label: "Baked Bread" },
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOMO3UwVdQYeR-j075UzNx11gKxJ7djP2QnlHJERDmsA&s=10", label: "Avocados" },
];

function Photo3DShowcase() {
  const [angle, setAngle] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const count = ITEMS.length;
  const radius = 220;

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = setInterval(() => setAngle((a) => a + 0.5), 30);
    return () => clearInterval(id);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const node = sceneRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setTiltY(y * 14);
  }

  function handleMouseLeave() {
    setTiltY(0);
  }

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: "1400px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={sceneRef}
        className="relative"
        style={{
          width: "220px",
          height: "220px",
          transformStyle: "preserve-3d",
          transform: `rotateY(${angle + tiltY}deg)`,
          transition: "transform 0.1s linear",
        }}
      >
        {ITEMS.map((item, i) => {
          const itemAngle = (360 / count) * i;
          return (
            <div
              key={item.label}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-field-100"
              style={{
                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-forest-900/70 to-transparent p-3">
                <span className="text-white text-xs font-semibold">{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Photo3DShowcase;
