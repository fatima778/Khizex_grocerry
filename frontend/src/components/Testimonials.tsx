import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Anas Tahir",
    text: "Awesome app, very useful! Very fast delivery and economical products. Quality and commitment is top notch.",
    rating: 5,
  },
  {
    name: "Fizza Zubair",
    text: "Totally loving the instant deliveries at my doorstep whenever I realize I need something last minute. Prices are great compared to others!",
    rating: 5,
    featured: true,
  },
  {
    name: "Vania Riaz",
    text: "Best app to get almost anything within 10-15 minutes with very little delivery charges. The grocery items are always fresh.",
    rating: 4,
  },
];

function Testimonials() {
  return (
    <section className="bg-white py-20 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-leaf-500/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-mustard-400/10 blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-leaf-600">Loved by shoppers</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 mt-2">Happy Khizex Shoppers</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-center max-w-4xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.3, delay: i * 0.15 }}
              className={`group relative rounded-3xl p-6 min-h-[19rem] flex flex-col cursor-default transition-shadow duration-300 hover:shadow-2xl ${
                t.featured
                  ? "bg-forest-900 md:-translate-y-4 shadow-2xl"
                  : "bg-forest-700 shadow-sm"
              }`}
            >
              <motion.div whileHover={{ rotate: -8, scale: 1.15 }} transition={{ type: "spring", stiffness: 300 }}>
                <Quote className="w-7 h-7 text-mustard-400 mb-4" />
              </motion.div>
              <p className="text-white/90 text-sm leading-relaxed mb-6 flex-1">{t.text}</p>
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < t.rating
                          ? "fill-mustard-400 text-mustard-400"
                          : "fill-transparent text-white/30"
                      }`}
                    />
                  ))}
                </div>
                <motion.div
                  className="h-0.5 bg-mustard-400 mb-2"
                  initial={{ width: "2.5rem" }}
                  whileHover={{ width: "4rem" }}
                  transition={{ duration: 0.3 }}
                />
                <p className="font-bold text-white text-sm tracking-wide">{t.name.toUpperCase()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;