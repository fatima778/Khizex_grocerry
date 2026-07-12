import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  eyebrow: string;
  title: string;
  sub: string;
  cta: string;
  bg: string;
  basket: { emoji: string; label: string; color: string }[];
}

const SLIDES: Slide[] = [
  {
    eyebrow: "This week only",
    title: "Fresh groceries, best prices in town.",
    sub: "Farm-direct produce, pantry staples and daily essentials — all delivered the same day.",
    cta: "Shop the sale",
    bg: "from-leaf-700 via-leaf-600 to-forest-800",
    basket: [
      { emoji: "🍅", label: "Tomatoes", color: "bg-coral-500" },
      { emoji: "🥛", label: "Milk", color: "bg-sky-400" },
      { emoji: "🍞", label: "Bread", color: "bg-mustard-500" },
      { emoji: "🧃", label: "Juice", color: "bg-leaf-500" },
    ],
  },
  {
    eyebrow: "Live inventory",
    title: "Never order something that's already sold out.",
    sub: "Our stock updates in real time, so the last of anything is always accurate — down to the unit.",
    cta: "See what's in stock",
    bg: "from-coral-600 via-coral-500 to-forest-800",
    basket: [
      { emoji: "🥦", label: "Broccoli", color: "bg-leaf-500" },
      { emoji: "🧀", label: "Cheese", color: "bg-mustard-400" },
      { emoji: "🥚", label: "Eggs", color: "bg-field-100" },
      { emoji: "🧴", label: "Cleaning", color: "bg-sky-500" },
    ],
  },
  {
    eyebrow: "New this month",
    title: "Pantry restock day — everything you forgot to buy.",
    sub: "Rice, oils, spices and bakery favourites — restocked daily so nothing sits on a shelf too long.",
    cta: "Browse pantry",
    bg: "from-mustard-600 via-coral-500 to-forest-800",
    basket: [
      { emoji: "🌾", label: "Rice", color: "bg-mustard-500" },
      { emoji: "🫒", label: "Oil", color: "bg-leaf-600" },
      { emoji: "🌶️", label: "Spices", color: "bg-coral-500" },
      { emoji: "🥐", label: "Bakery", color: "bg-mustard-400" },
    ],
  },
];

function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  function prev() {
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }
  function next() {
    setIndex((i) => (i + 1) % SLIDES.length);
  }

  return (
    <section className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
        >
          {/* soft light bloom to mimic store-aisle lighting */}
          <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] rounded-full bg-white/10 blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] rounded-full bg-black/10 blur-3xl translate-y-1/3" />
        </motion.div>
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative z-10 order-2 lg:order-1 text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <span className="inline-block text-xs font-bold uppercase tracking-widest mb-4 text-mustard-300">
                  {slide.eyebrow}
                </span>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] mb-5">
                  {slide.title}
                </h1>
                <p className="text-white/80 text-base sm:text-lg max-w-lg mb-8">{slide.sub}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4">
              <Link
                to="#shop"
                className="group inline-flex items-center gap-2 bg-white hover:bg-field-100 text-forest-900 font-bold px-7 py-3.5 rounded-full transition-colors"
              >
                {slide.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-2">
                <button onClick={prev} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-8">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-3 bg-white/30"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* "Flying basket" composition, Metro-style, built with layered product chips */}
          <div className="relative order-1 lg:order-2 h-72 sm:h-96 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-64 h-64 sm:w-80 sm:h-80"
                >
                  {/* basket bowl */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 sm:w-72 h-28 sm:h-32 bg-forest-900/90 rounded-b-[3rem] rounded-t-xl shadow-2xl" />
                  <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 w-60 sm:w-76 h-3 bg-mustard-400/80 rounded-full" />
                  {/* basket handle */}
                  <div className="absolute bottom-40 sm:bottom-48 left-1/2 -translate-x-1/2 w-32 h-20 border-[6px] border-forest-900/80 rounded-t-full border-b-0" />

                  {/* product chips spilling out of the basket */}
                  {slide.basket.map((item, i) => {
                    const positions = [
                      "left-2 bottom-28 sm:bottom-32 rotate-[-8deg]",
                      "left-1/3 bottom-40 sm:bottom-44 rotate-[4deg]",
                      "right-1/3 bottom-40 sm:bottom-44 rotate-[-4deg]",
                      "right-2 bottom-28 sm:bottom-32 rotate-[8deg]",
                    ];
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 * i, type: "spring" }}
                        className={`absolute ${positions[i]} ${item.color} w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-0.5`}
                      >
                        <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-forest-900/70">{item.label}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
