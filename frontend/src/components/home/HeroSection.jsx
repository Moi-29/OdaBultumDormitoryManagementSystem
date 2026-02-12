import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroImg from "../../assets/Hero-Section.jpg";
import { useLanguage } from "../../context/LanguageContext";
import { homeTranslations } from "../../translations/translations";

const HeroSection = () => {
  const { language } = useLanguage();
  const t = (key) => homeTranslations[language]?.[key] || homeTranslations.en[key] || key;
  
  return (
    <section className="relative w-full h-[calc(100vh-81px)] overflow-hidden">
      {/* Premium Google Fonts Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800&display=swap');
        `}
      </style>
      
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src={heroImg}
          alt="Oda Bultum University Campus"
          className="w-full h-full object-cover"
        />
        {/* Enhanced overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </motion.div>

      {/* Shimmer overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="shimmer absolute inset-0 opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: '#F5E6D3',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.3)',
            letterSpacing: '0.3em',
            fontWeight: 500
          }}
          className="text-sm md:text-base uppercase mb-4"
        >
          {t('heroSubtitle')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontFamily: "'Cinzel', serif",
            background: 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 25%, #FFD700 50%, #F0E68C 75%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 4px 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.9))',
            fontWeight: 700,
            letterSpacing: '0.02em'
          }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-5xl leading-tight"
        >
          {t('heroTitle')}
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
            color: '#1a1a1a',
            fontWeight: 700,
            letterSpacing: '0.1em',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
            border: '2px solid rgba(255, 215, 0, 0.3)'
          }}
          className="mt-8 px-8 py-3.5 rounded-full text-sm
            hover:scale-105 transition-all duration-300"
          onClick={() => document.getElementById("guidelines")?.scrollIntoView({ behavior: "smooth" })}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 12px 48px rgba(212, 175, 55, 0.6), 0 0 80px rgba(255, 215, 0, 0.4)';
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(212, 175, 55, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {t('exploreCampus')}
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8))'
          }}
        >
          <ChevronDown 
            className="w-6 h-6" 
            style={{ 
              color: '#FFD700',
              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))'
            }} 
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
