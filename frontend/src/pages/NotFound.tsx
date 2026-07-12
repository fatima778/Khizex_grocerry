import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StorefrontLayout from "../layouts/StorefrontLayout";

function NotFound() {
  return (
    <StorefrontLayout>
      <div className="max-w-xl mx-auto px-4 py-28 text-center">
        <motion.p
          className="text-8xl mb-6 inline-block"
          animate={{ rotate: [0, -8, 8, -6, 0], y: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1 }}
        >
          🍌
        </motion.p>
        <h1 className="font-display text-4xl font-bold text-forest-900 mb-3">This aisle is empty</h1>
        <p className="text-forest-700/60 mb-8">
          We looked everywhere on the shelf, but this page doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-forest-900 hover:bg-leaf-600 text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
        >
          Back to the shop
        </Link>
      </div>
    </StorefrontLayout>
  );
}

export default NotFound;
