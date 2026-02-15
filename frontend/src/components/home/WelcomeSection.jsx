import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper from "../SectionWrapper";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { homeTranslations } from "../../translations/translations";
import placeholderImage from "../../assets/Directorate.jpg";

const WelcomeSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const t = (key) => homeTranslations[language]?.[key] || homeTranslations.en[key] || key;

  // Card data structure - 7 cards total
  const cards = [
    // Top row - 3 cards
    {
      id: 1,
      image: placeholderImage,
      title: t('card1Title') || "Leadership Excellence",
      description: t('card1Desc') || "Dedicated leadership driving student success and campus innovation."
    },
    {
      id: 2,
      image: placeholderImage,
      title: t('card2Title') || "Student Services",
      description: t('card2Desc') || "Comprehensive support services for academic and personal growth."
    },
    {
      id: 3,
      image: placeholderImage,
      title: t('card3Title') || "Campus Life",
      description: t('card3Desc') || "Vibrant community fostering diversity and student engagement."
    },
    // Middle row - 1 large featured card
    {
      id: 4,
      image: placeholderImage,
      title: t('card4Title') || "MR. LELISA SHAMSEDIN",
      subtitle: t('card4Subtitle') || "Director of Student Services",
      description: t('card4Desc') || "A dedicated administrative leader, Mr. Lelisa Shamsedin is responsible for the comprehensive management of student-focused operations. His role encompasses high-level coordination of essential services designed to enhance the student experience. Under his leadership, the Directorate focuses on operational efficiency, student advocacy, and the development of a vibrant and inclusive university culture.",
      featured: true
    },
    // Bottom row - 3 cards
    {
      id: 5,
      image: placeholderImage,
      title: t('card5Title') || "Academic Support",
      description: t('card5Desc') || "Resources and guidance to help students achieve their academic goals."
    },
    {
      id: 6,
      image: placeholderImage,
      title: t('card6Title') || "Wellness Programs",
      description: t('card6Desc') || "Holistic health and wellness initiatives for student well-being."
    },
    {
      id: 7,
      image: placeholderImage,
      title: t('card7Title') || "Career Development",
      description: t('card7Desc') || "Professional development and career preparation opportunities."
    }
  ];

  return (
    <SectionWrapper 
      className="relative py-16 md:py-24 overflow-hidden" 
      style={{ 
        backgroundColor: isDarkMode ? '#0f172a' : '#f8f9fa',
        transition: 'background-color 0.3s ease'
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
          
          .image-card {
            position: relative;
            overflow: hidden;
            border-radius: 16px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .image-card:hover {
            transform: translateY(-8px);
          }
          
          .image-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%);
            z-index: 1;
            transition: opacity 0.3s ease;
          }
          
          .image-card:hover::before {
            opacity: 0.9;
          }
          
          .card-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1.5rem;
            z-index: 2;
            color: white;
          }
          
          .featured-card {
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          
          .featured-card::before {
            background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%);
          }
        `}
      </style>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              background: isDarkMode 
                ? 'linear-gradient(135deg, #d4af37 0%, #f4e5c3 50%, #d4af37 100%)'
                : 'linear-gradient(135deg, #8B7355 0%, #d4af37 50%, #8B7355 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}
          >
            {t('leadershipTitle') || "Leadership & Excellence"}
          </h2>
          <div 
            style={{
              width: '120px',
              height: '4px',
              background: isDarkMode ? '#d4af37' : '#8B7355',
              margin: '0 auto',
              borderRadius: '2px'
            }}
          />
        </motion.div>

        {/* Top Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {cards.slice(0, 3).map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="image-card"
              style={{
                height: '320px',
                boxShadow: isDarkMode 
                  ? '0 10px 40px rgba(0,0,0,0.5)'
                  : '0 10px 40px rgba(0,0,0,0.15)'
              }}
            >
              <img 
                src={card.image} 
                alt={card.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div className="card-content">
                <h3 
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  {card.title}
                </h3>
                <p 
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    opacity: 0.95
                  }}
                >
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Middle Row - 1 Large Featured Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="image-card featured-card mb-6"
          style={{
            height: '500px',
            boxShadow: isDarkMode 
              ? '0 25px 80px rgba(212, 175, 55, 0.3)'
              : '0 25px 80px rgba(139, 115, 85, 0.25)'
          }}
        >
          <img 
            src={cards[3].image} 
            alt={cards[3].title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div className="card-content" style={{ padding: '2.5rem' }}>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 700,
                marginBottom: '0.75rem',
                letterSpacing: '0.03em',
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                lineHeight: 1.2
              }}
            >
              {cards[3].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 500,
                marginBottom: '1rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#d4af37'
              }}
            >
              {cards[3].subtitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.1rem',
                lineHeight: 1.7,
                opacity: 0.95,
                maxWidth: '900px'
              }}
            >
              {cards[3].description}
            </motion.p>
          </div>
        </motion.div>

        {/* Bottom Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.slice(4, 7).map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.15 }}
              className="image-card"
              style={{
                height: '320px',
                boxShadow: isDarkMode 
                  ? '0 10px 40px rgba(0,0,0,0.5)'
                  : '0 10px 40px rgba(0,0,0,0.15)'
              }}
            >
              <img 
                src={card.image} 
                alt={card.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div className="card-content">
                <h3 
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  {card.title}
                </h3>
                <p 
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    opacity: 0.95
                  }}
                >
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default WelcomeSection;
