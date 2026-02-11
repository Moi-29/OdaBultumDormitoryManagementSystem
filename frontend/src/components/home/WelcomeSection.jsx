import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
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

  return (
    <SectionWrapper className="relative py-20 md:py-28 overflow-hidden" style={{ backgroundColor: isDarkMode ? '#0f172a' : 'white', transition: 'background-color 0.3s ease' }}>
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative">
              {/* Green Circle Border */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute inset-0 rounded-full border-4 z-10"
                style={{ borderColor: '#4ade80' }}
              />
              
              {/* Circular Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-20 w-[400px] h-[400px] rounded-full overflow-hidden"
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
            className="space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold"
            >
              <span style={{ color: '#4ade80' }}>{t('welcomeSectionTitlePart1')}</span>{' '}
              <span style={{ color: isDarkMode ? '#ffffff' : '#111827', transition: 'color 0.3s ease' }}>
                {t('welcomeSectionTitlePart2')}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base md:text-lg leading-relaxed"
              style={{ color: isDarkMode ? '#d1d5db' : '#6b7280', transition: 'color 0.3s ease' }}
            >
              {t('welcomeSectionDescription')}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default WelcomeSection;
