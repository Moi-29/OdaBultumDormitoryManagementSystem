import { motion } from "framer-motion";
import { ArrowUp, Mail, MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { translations, getTranslation } from "../../translations/translations";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <footer className="relative overflow-hidden">
      {/* Main footer */}
      <div className="bg-[#1e3a5f] text-white/70 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-display text-xl text-gold mb-4">{t('universityName')}</h4>
              <p className="font-body text-sm leading-relaxed">
                {t('universityDescription')}
              </p>
            </div>
            <div>
              <h5 className="font-body font-semibold text-white/90 mb-4">{t('contact')}</h5>
              <div className="space-y-2 text-sm font-body">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" /> {t('location')}</div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> {t('email')}</div>
              </div>
            </div>
            <div>
              <h5 className="font-body font-semibold text-white/90 mb-4">{t('motto')}</h5>
              <p className="font-display text-gold-light italic text-lg">
                "{t('universityMotto')}"
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-white/50">
              {t('copyright')}
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
