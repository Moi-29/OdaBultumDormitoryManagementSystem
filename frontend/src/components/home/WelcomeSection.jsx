import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper from "../SectionWrapper";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { homeTranslations } from "../../translations/translations";
import imageOne from "../../assets/one.jpg";
import imageTwo from "../../assets/two.jpg";
import imageThree from "../../assets/three.jpg";
import imageFour from "../../assets/four.jpg";
import imageFive from "../../assets/five.jpg";
import imageSix from "../../assets/six.jpg";
import imageSeven from "../../assets/seven.jpg";

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
      image: imageOne,
      title: t('leaderCard1Title'),
      description: t('leaderCard1Desc')
    },
    {
      id: 2,
      image: imageTwo,
      title: t('leaderCard2Title'),
      description: t('leaderCard2Desc')
    },
    {
      id: 3,
      image: imageThree,
      title: t('leaderCard3Title'),
      description: t('leaderCard3Desc')
    },
    // Middle row - 1 large featured card
    {
      id: 4,
      image: imageFour,
      title: t('leaderCard4Title'),
      subtitle: "",
      description: t('leaderCard4Desc'),
      featured: true
    },
    // Bottom row - 3 cards
    {
      id: 5,
      image: imageFive,
      title: t('leaderCard5Title'),
      description: t('leaderCard5Desc')
    },
    {
      id: 6,
      image: imageSix,
      title: t('leaderCard6Title'),
      description: t('leaderCard6Desc')
    },
    {
      id: 7,
      image: imageSeven,
      title: t('leaderCard7Title'),
      description: t('leaderCard7Desc')
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
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border-radius: 16px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          
          .image-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          }
          
          .card-image-section {
            width: 100%;
            height: 250px;
            overflow: hidden;
          }
          
          .card-image-section img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
          }
          
          .featured-card .card-image-section img {
            object-position: center 30%;
          }
          
          .image-card:hover .card-image-section img {
            transform: scale(1.05);
          }
          
          .card-text-section {
            background: white;
            padding: 1.5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .featured-card {
            border-radius: 20px;
          }
          
          .featured-card .card-image-section {
            height: 250px;
          }
          
          .featured-card .card-text-section {
            padding: 2rem;
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
                height: '450px'
              }}
            >
              <div className="card-image-section">
                <img 
                  src={card.image} 
                  alt={card.title}
                />
              </div>
              <div className="card-text-section">
                <h3 
                  style={{
                    fontFamily: index === 0 ? "'Playfair Display', serif" : "'Montserrat', sans-serif",
                    fontSize: index === 0 ? 'clamp(1.5rem, 3vw, 2rem)' : '1.25rem',
                    fontWeight: index === 0 ? 700 : 600,
                    marginBottom: '0.75rem',
                    letterSpacing: index === 0 ? '0.03em' : '0.5px',
                    color: '#1f2937',
                    lineHeight: 1.2
                  }}
                >
                  {card.title}
                </h3>
                <p 
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: '#4b5563'
                  }}
                >
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Middle Row - 1 Featured Card (Centered, Same Width as Others) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="image-card featured-card"
            style={{
              height: '450px'
            }}
          >
            <div className="card-image-section">
              <img 
                src={cards[3].image} 
                alt={cards[3].title}
              />
            </div>
            <div className="card-text-section">
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  letterSpacing: '0.5px',
                  lineHeight: 1.2,
                  color: '#1f2937'
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
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  marginBottom: '0.75rem',
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
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: '#4b5563'
                }}
              >
                {cards[3].description}
              </motion.p>
            </div>
          </motion.div>
          <div></div>
        </div>

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
                height: '450px'
              }}
            >
              <div className="card-image-section">
                <img 
                  src={card.image} 
                  alt={card.title}
                />
              </div>
              <div className="card-text-section">
                <h3 
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                    letterSpacing: '0.5px',
                    color: '#1f2937'
                  }}
                >
                  {card.title}
                </h3>
                <p 
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: '#4b5563'
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
