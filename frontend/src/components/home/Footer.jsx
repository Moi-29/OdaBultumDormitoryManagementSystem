import { motion } from "framer-motion";
import { ArrowUp, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden">
      {/* Main footer */}
      <div className="bg-[#1e3a5f] text-white/70 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-display text-xl text-gold mb-4">Oda Bultum University</h4>
              <p className="font-body text-sm leading-relaxed">
                Empowering the next generation through knowledge, integrity, and service to the community.
              </p>
            </div>
            <div>
              <h5 className="font-body font-semibold text-white/90 mb-4">Contact</h5>
              <div className="space-y-2 text-sm font-body">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" /> Chiro, Oromia, Ethiopia</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold" /> +251-25-511-XXXX</div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> info@obu.edu.et</div>
              </div>
            </div>
            <div>
              <h5 className="font-body font-semibold text-white/90 mb-4">Motto</h5>
              <p className="font-display text-gold-light italic text-lg">
                "Education for Community Development"
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-white/50">
              © 2026 Oda Bultum University. All rights reserved.
            </p>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center
                hover:bg-gold/30 transition-colors"
            >
              <ArrowUp className="w-4 h-4 text-gold" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
