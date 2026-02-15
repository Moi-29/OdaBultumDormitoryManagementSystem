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
      title: "Prof. Muktar Mohammed — President",
      description: "Prof. Muktar Mohammed provides the highest level of executive leadership that defines the university's institutional vision and strategic trajectory. He guides policy formulation, governance frameworks, and long-term academic development initiatives. His leadership ensures the alignment of teaching, research, and community engagement with national priorities. Through principled stewardship, he fosters a culture of excellence, innovation, and institutional resilience."
    },
    {
      id: 2,
      image: imageTwo,
      title: "Getachew Gashaw (Assist. Professor) — Director, Academic program and staff development directorate",
      description: "Getachew Gashaw oversees the systematic development and continual enhancement of academic programs within the institution. He leads initiatives aimed at strengthening faculty competence and instructional effectiveness. His directorate promotes curriculum relevance in response to emerging educational and professional demands. Through sustained professional development strategies, he advances academic quality and pedagogical innovation."
    },
    {
      id: 3,
      image: imageThree,
      title: "Alemayehu Bayene (Assist. Professor) — Vice President",
      description: "Alemayehu Bayene serves as a pivotal force in the coordination and implementation of the university's strategic directives. He supports executive decision-making by ensuring administrative and academic operations function cohesively. His office facilitates institutional efficiency through structured collaboration across departments. Through operational oversight, he strengthens institutional stability and performance outcomes."
    },
    // Middle row - 1 large featured card
    {
      id: 4,
      image: imageFour,
      title: "Mr. Lelisa Shamsedin — Student service directorate",
      subtitle: "",
      description: "Mr. Lelisa Shamsedin directs the institutional services that support student wellbeing and academic engagement. He ensures the effective delivery of programs that address student needs across academic and social dimensions. His leadership enhances student satisfaction through responsive and inclusive service frameworks. Through structured support systems, he promotes a balanced and enabling campus experience.",
      featured: true
    },
    // Bottom row - 3 cards
    {
      id: 5,
      image: imageFive,
      title: "Ibsa Ahmed (PhD) — Vice president For Adminstration and development",
      description: "Ibsa Ahmed supervises the administrative and developmental functions that sustain institutional growth and infrastructure. He ensures the strategic utilization of resources to support operational effectiveness. His office drives initiatives that enhance administrative efficiency and organizational advancement. Through forward-looking management practices, he strengthens institutional capacity and development outcomes."
    },
    {
      id: 6,
      image: imageSix,
      title: "Ahmedin Abdurahman (PhD) — Director, Quality assurance directorate",
      description: "Ahmedin Abdurahman leads the institutional systems that safeguard academic standards and operational quality. He administers evaluation frameworks to ensure adherence to established benchmarks and regulatory requirements. His directorate promotes continuous improvement through systematic monitoring and assessment. Through quality-focused leadership, he reinforces institutional credibility and accountability."
    },
    {
      id: 7,
      image: imageSeven,
      title: "Mr. Ararsa Gudisa — Director, University registrar",
      description: "Mr. Ararsa Gudisa manages the university's academic records and regulatory documentation processes. He ensures accuracy and integrity in admissions, enrollment, and certification procedures. His office coordinates academic progression in accordance with institutional regulations. Through meticulous administrative oversight, he maintains institutional trust and compliance."
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
