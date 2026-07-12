import { Link } from "react-router-dom";
import { ShoppingBasket, Instagram, Twitter, Facebook } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-forest-900 text-field-100 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-leaf-500 flex items-center justify-center">
                <ShoppingBasket className="w-4 h-4 text-forest-900" />
              </div>
              <span className="font-display text-lg font-bold text-white">Khizex.</span>
            </div>
            <p className="text-sm text-field-100/60 max-w-xs">
              Farm-fresh groceries, picked this morning and on your doorstep before dinner.
              Real produce, real people, real fast.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-leaf-500 hover:text-forest-900 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-field-100/60">
              <li><Link to="/" className="hover:text-mustard-400 transition-colors">All groceries</Link></li>
              <li><Link to="/cart" className="hover:text-mustard-400 transition-colors">Your cart</Link></li>
              <li><Link to="/orders" className="hover:text-mustard-400 transition-colors">Track orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-field-100/60">
              <li><a href="#" className="hover:text-mustard-400 transition-colors">About Khizex</a></li>
              <li><a href="#" className="hover:text-mustard-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-mustard-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-field-100/40">© 2026 Khizex Grocery. Built for the Khizex internship challenge.</p>
          <p className="text-xs text-field-100/40">Test-mode payments only — no real transactions.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
