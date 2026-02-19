import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import heroImg from "../../assets/Hero-Section.jpg";
import { useLanguage } from "../../context/LanguageContext";
import { homeTranslations } from "../../translations/translations";
import API_URL from "../../config/api";

const HeroSection = () => {
  const { language } = useLanguage();
  const t = (key) => homeTranslations[language]?.[key] || homeTranslations.en[key] || key;
  
  const [content, setContent] = useState({
    heroTitle: t('heroTitle'),
    heroSubtitle: t('heroSubtitle'),
    heroDescription: '',
    heroImage: heroImg
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/home-content`);
        setContent({
          heroTitle: data.heroTitle || t('heroTitle'),
          heroSubtitle: data.heroSubtitle || t('heroSubtitle'),
          heroDescription: data.heroDescription || '',
          heroImage: data.heroImage || heroImg
        });
      } catch (error) {
        console.error('Error fetching hero content:', error);
        // Keep default content if fetch fails
      }
    };

    fetchContent();
  }, []);
  
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
          src={content.heroImage}
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
          {content.heroSubtitle}
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
          {content.heroTitle}
        </motion.h1>
      </div>
    </section>
  );
};

export default HeroSection;
