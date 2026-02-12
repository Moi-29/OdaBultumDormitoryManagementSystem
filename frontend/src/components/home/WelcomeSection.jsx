import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import SectionWrapper from "../SectionWrapper";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { homeTranslations } from "../../translations/translations";
import welcomeImage from "../../assets/Directorate.jpg";

const WelcomeSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const t = (key) => homeTranslations[language]?.[key] || homeTranslations.en[key] || key;
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <SectionWrapper 
      className="relative py-20 md:py-28 overflow-hidden" 
      style={{ 
        backgroundColor: isDarkMode ? '#0f172a' : '#f5f5f0',
        transition: 'background-color 0.3s ease',
        position: 'relative'
      }}
    >
      {/* Decorative Corner Lines - Hidden on mobile */}
      <div className="hidden md:block" style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        width: '250px',
        height: '250px',
        borderTop: isDarkMode ? '3px solid #d4af37' : '3px solid #c9b037',
        borderLeft: isDarkMode ? '3px solid #d4af37' : '3px solid #c9b037',
        opacity: 0.6
      }} />
      <div className="hidden md:block" style={{
        position: 'absolute',
        top: '40px',
        right: '40px',
        width: '250px',
        height: '250px',
        borderTop: isDarkMode ? '3px solid #d4af37' : '3px solid #c9b037',
        borderRight: isDarkMode ? '3px solid #d4af37' : '3px solid #c9b037',
        opacity: 0.6
      }} />
      <div className="hidden md:block" style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        width: '250px',
        height: '250px',
        borderBottom: isDarkMode ? '3px solid #d4af37' : '3px solid #c9b037',
        borderLeft: isDarkMode ? '3px solid #d4af37' : '3px solid #c9b037',
        opacity: 0.6
      }} />
      <div className="hidden md:block" style={{
        position: 'absolute',
        bottom: '40px',
        right: '40px',
        width: '250px',
        height: '250px',
        borderBottom: isDarkMode ? '3px solid #d4af37' : '3px solid #c9b037',
        borderRight: isDarkMode ? '3px solid #d4af37' : '3px solid #c9b037',
        opacity: 0.6
      }} />

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:wght@400;600;700&display=swap');
        `}
      </style>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative">
              {/* Elegant Gold Circle Border */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute inset-0 rounded-full z-10"
                style={{ 
                  border: isDarkMode ? '4px solid #d4af37' : '4px solid #c9b037',
                  boxShadow: isDarkMode 
                    ? '0 0 30px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(212, 175, 55, 0.1)'
                    : '0 0 30px rgba(201, 176, 55, 0.3), inset 0 0 20px rgba(201, 176, 55, 0.1)'
                }}
              />
              
              {/* Circular Image - Responsive sizing */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-20 rounded-full overflow-hidden"
                style={{
                  width: isMobile ? '280px' : '380px',
                  height: isMobile ? '280px' : '380px',
                  boxShadow: isDarkMode 
                    ? '0 25px 70px rgba(0, 0, 0, 0.6), 0 15px 40px rgba(0, 0, 0, 0.5), 0 8px 20px rgba(0, 0, 0, 0.4)'
                    : '0 25px 70px rgba(0, 0, 0, 0.4), 0 15px 40px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.25)'
                }}
              >
                <img
                  src={welcomeImage}
                  alt={t('welcomeSectionTitle')}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 15%' }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 lg:space-y-8"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center lg:text-left"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? '2rem' : '3.5rem',
                fontWeight: 600,
                lineHeight: 1.3,
                letterSpacing: '0.02em'
              }}
            >
              <span style={{ 
                color: isDarkMode ? '#d4af37' : '#8B7355',
                display: 'block',
                marginBottom: '0.25rem'
              }}>
                {t('welcomeSectionTitlePart1')}
              </span>
              <span style={{ 
                color: isDarkMode ? '#d4af37' : '#8B7355',
                display: 'block'
              }}>
                {t('welcomeSectionTitlePart2')}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center lg:text-justify"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? '1rem' : '1.125rem',
                lineHeight: 1.8,
                color: isDarkMode ? '#d1d5db' : '#4a4a4a',
                transition: 'color 0.3s ease'
              }}
            >
              {t('welcomeSectionDescription')}
            </motion.p>
          </motion.div>
        </div>

        {/* Directorate Title - Bottom Center */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 lg:mt-20 text-center px-4"
        >
          <h3 
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: isMobile ? '0.95rem' : '2rem',
              fontWeight: 400,
              color: isDarkMode ? '#d4af37' : '#8B7355',
              letterSpacing: isMobile ? '0.15em' : '0.25em',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              position: 'relative',
              display: 'inline-block',
              padding: isMobile ? '0 1.5rem' : '0 3rem',
              wordBreak: 'break-word',
              maxWidth: '100%',
              lineHeight: 1.5
            }}
          >
            <span style={{
              position: 'relative',
              zIndex: 1
            }}>
              {t('directorateTitle')}
            </span>
            {/* Decorative lines on sides - Hidden on very small screens */}
            <span className="hidden sm:inline-block" style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              width: isMobile ? '1rem' : '2rem',
              height: '1px',
              backgroundColor: isDarkMode ? '#d4af37' : '#8B7355',
              opacity: 0.5
            }} />
            <span className="hidden sm:inline-block" style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              width: isMobile ? '1rem' : '2rem',
              height: '1px',
              backgroundColor: isDarkMode ? '#d4af37' : '#8B7355',
              opacity: 0.5
            }} />
          </h3>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default WelcomeSection;
