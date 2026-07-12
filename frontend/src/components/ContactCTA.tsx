import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Mail, Phone } from "lucide-react";
import { useAuthStore } from "../store/authStore";

function ContactCTA() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section className="bg-field-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-forest-900 rounded-[2.5rem] overflow-hidden p-10 sm:p-14"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-leaf-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-mustard-400/10 blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-14 h-14 rounded-2xl bg-leaf-500 flex items-center justify-center mb-6"
              >
                <MessageCircle className="w-7 h-7 text-forest-900" />
              </motion.div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                Have a question or a complaint?
              </h2>
              <p className="text-field-100/70 mb-8 max-w-md">
                Our support team replies fast — track a missing item, report a damaged
                delivery, or just say hi. Every message gets a real, live reply.
              </p>

              <Link
                to={isAuthenticated ? "/contact" : "/login"}
                className="group inline-flex items-center gap-2 bg-white hover:bg-field-100 text-forest-900 font-bold px-7 py-3.5 rounded-full transition-colors"
              >
                {isAuthenticated ? "Start a conversation" : "Log in to contact us"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-mustard-400" />
                </div>
                <div>
                  <p className="text-xs text-field-100/50">Email us</p>
                  <p className="text-white font-semibold text-sm">support@khizexgrocery.com</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-mustard-400" />
                </div>
                <div>
                  <p className="text-xs text-field-100/50">Call us</p>
                  <p className="text-white font-semibold text-sm">+92 300 1234567</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactCTA;
