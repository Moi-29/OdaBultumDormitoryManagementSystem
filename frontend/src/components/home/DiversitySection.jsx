import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Globe, Heart, Languages, Users, Handshake, Shield, Star, Award, BookOpen, Smile, Target, Zap } from "lucide-react";
import { useState } from "react";
import SectionWrapper from "../SectionWrapper";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { homeTranslations } from "../../translations/translations";

const DiversitySection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const t = (key) => homeTranslations[language]?.[key] || homeTranslations.en[key] || key;
  const [showAll, setShowAll] = useState(false);

  const diversityCards = [
    {
      icon: Globe,
      title: t('culturalExchange'),
      description: t('culturalExchangeDesc')
    },
    {
      icon: Handshake,
      title: t('inclusiveCommunity'),
      description: t('inclusiveCommunityDesc')
    },
    {
      icon: Shield,
      title: t('zeroTolerance'),
      description: t('zeroToleranceDesc')
    },
    {
      icon: Languages,
      title: t('languageSupport'),
      description: t('languageSupportDesc')
    },
    {
      icon: Heart,
      title: t('religiousFreedom'),
      description: t('religiousFreedomDesc')
    },
    {
      icon: Star,
      title: t('equalOpportunity'),
      description: t('equalOpportunityDesc')
    },
    {
      icon: Users,
      title: t('disabilitySupport'),
      description: t('disabilitySupportDesc')
    },
    {
      icon: Handshake,
      title: t('conflictMediation'),
      description: t('conflictMediationDesc')
    },
    {
      icon: Award,
      title: t('culturalEvents'),
      description: t('culturalEventsDesc')
    },
    {
      icon: Smile,
      title: t('peerSupport'),
      description: t('peerSupportDesc')
    },
    {
      icon: Target,
      title: t('safeSpaces'),
      description: t('safeSpacesDesc')
    },
    {
      icon: Zap,
      title: t('diversityTraining'),
      description: t('diversityTrainingDesc')
    },
  ];

  return (
    <SectionWrapper className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle rainbow background */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          background: "linear-gradient(135deg, #FF6B6B 0%, #FFD93D 16%, #6BCB77 33%, #4D96FF 50%, #9B59B6 66%, #FF6B6B 100%)"
        }} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full opacity-20"
          style={{
            background: `hsl(${i * 60}, 70%, 60%)`,
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">{t('diversitySubtitle')}</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: isDarkMode ? '#ffffff' : '#111827', transition: 'color 0.3s ease' }}>
            {t('diversityTitle')}
          </h2>
          <p className="font-body max-w-2xl mx-auto mb-12" style={{ color: isDarkMode ? '#d1d5db' : '#6b7280', transition: 'color 0.3s ease' }}>
            {t('diversityDesc')}
          </p>
        </motion.div>

        {/* Diversity Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diversityCards.slice(0, showAll ? diversityCards.length : 6).map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                className="p-6 hover:scale-[1.03] transition-all duration-300 text-left rounded-2xl"
                style={{
                  backgroundColor: isDarkMode ? '#1e293b' : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: isDarkMode ? '1px solid #475569' : '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, hsl(262, 85%, 34%), hsl(43, 72%, 52%))" }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="font-display text-xl font-bold mb-3" style={{ color: isDarkMode ? '#ffffff' : '#111827', transition: 'color 0.3s ease' }}>
                  {card.title}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: isDarkMode ? '#d1d5db' : '#6b7280', transition: 'color 0.3s ease' }}>
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Show More/Less Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: isDarkMode ? '#4F46E5' : '#4F46E5',
              color: 'white',
              border: 'none'
            }}
          >
            {showAll ? t('showLess') : t('showMore')}
          </button>
        </motion.div>

      </div>
    </SectionWrapper>
  );
};

export default DiversitySection;
