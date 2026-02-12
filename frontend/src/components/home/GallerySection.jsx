import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { getTranslation } from "../../translations/translations";

// Import all gallery images
import im from "../../assets/im.jpg";
import im1 from "../../assets/im1.jpg";
import im2 from "../../assets/im2.jpg";
import im3 from "../../assets/im3.jpg";
import im4 from "../../assets/im4.jpg";
import im5 from "../../assets/im5.jpg";
import im6 from "../../assets/im6.jpg";
import im7 from "../../assets/im7.jpg";
import im8 from "../../assets/im8.jpg";
import im9 from "../../assets/im9.jpg";
import im10 from "../../assets/im10.jpg";
import im11 from "../../assets/im11.jpg";
import im12 from "../../assets/im12.jpg";
import im13 from "../../assets/im13.jpg";
import im15 from "../../assets/im15.jpg";
import im16 from "../../assets/im16.jpg";
import im17 from "../../assets/im17.jpg";
import im18 from "../../assets/im18.jpg";
import im19 from "../../assets/im19.jpg";
import im20 from "../../assets/im20.jpg";
import im21 from "../../assets/im21.jpg";
import im22 from "../../assets/im22.jpg";

const GallerySection = () => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);
  
  // All 22 gallery items
  const galleryItems = [
    { src: im },
    { src: im1 },
    { src: im2 },
    { src: im3 },
    { src: im4 },
    { src: im5 },
    { src: im6 },
    { src: im7 },
    { src: im8 },
    { src: im9 },
    { src: im10 },
    { src: im11 },
    { src: im12 },
    { src: im13 },
    { src: im15 },
    { src: im16 },
    { src: im17 },
    { src: im18 },
    { src: im19 },
    { src: im20 },
    { src: im21 },
    { src: im22 }
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, galleryItems.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Get visible cards for 3D carousel effect
  const getVisibleCards = () => {
    const cards = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + galleryItems.length) % galleryItems.length;
      cards.push({ ...galleryItems[index], position: i, index });
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  return (
    <section 
      className="relative w-full py-12 md:py-20 overflow-hidden"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)'
          : 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
        minHeight: 'clamp(500px, 80vh, 700px)'
      }}
    >
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)`,
          width: '100%',
          height: '100%'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 style={{
            fontSize: 'clamp(1.75rem, 6vw, 3rem)',
            fontWeight: 800,
            color: 'white',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: 'clamp(0.05em, 1.5vw, 0.1em)',
            fontFamily: 'Montserrat, sans-serif',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}>
            {getTranslation(language, 'galleryTitle')}
          </h2>
          <div style={{
            width: 'clamp(60px, 15vw, 100px)',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
            margin: '0 auto 1.5rem'
          }} />
          <p style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '600px',
            margin: '0 auto',
            fontFamily: 'Montserrat, sans-serif',
            lineHeight: 1.6,
            padding: '0 1rem'
          }}>
            {getTranslation(language, 'galleryDesc')}
          </p>
        </motion.div>

        {/* 3D Carousel Container */}
        <div className="relative" style={{ 
          height: 'clamp(350px, 60vh, 500px)', 
          perspective: window.innerWidth < 768 ? '1000px' : '2000px' 
        }}>
          
          {/* 3D Card Stack */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="sync">
              {visibleCards.map((card) => {
                const position = card.position;
                const isCenter = position === 0;
                const isMobile = window.innerWidth < 768;
                
                // Mobile-optimized values
                const scale = isMobile 
                  ? (isCenter ? 1 : 0.6 - Math.abs(position) * 0.15)
                  : (isCenter ? 1 : 0.75 - Math.abs(position) * 0.1);
                const zIndex = 50 - Math.abs(position) * 10;
                const opacity = isCenter ? 1 : (isMobile ? 0.3 : 0.4 - Math.abs(position) * 0.1);
                const rotateY = isMobile ? position * 15 : position * 25;
                const translateX = isMobile ? position * 120 : position * 280;
                const translateZ = isCenter ? 0 : -Math.abs(position) * (isMobile ? 80 : 150);
                
                // Responsive card dimensions
                const cardWidth = isMobile ? 'min(280px, 85vw)' : '400px';
                const cardHeight = isMobile ? 'min(350px, 70vh)' : '450px';

                return (
                  <motion.div
                    key={card.index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity,
                      scale,
                      rotateY,
                      x: translateX,
                      z: translateZ,
                      zIndex
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.32, 0.72, 0, 1]
                    }}
                    className="absolute"
                    style={{
                      width: cardWidth,
                      height: cardHeight,
                      transformStyle: 'preserve-3d',
                      cursor: isCenter ? 'default' : 'pointer'
                    }}
                    onClick={() => !isCenter && goToSlide(card.index)}
                  >
                    {/* Card Container */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: isMobile ? '16px' : '20px',
                      overflow: 'hidden',
                      boxShadow: isCenter 
                        ? '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)'
                        : '0 20px 50px rgba(0, 0, 0, 0.4)',
                      transition: 'box-shadow 0.3s ease',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                      backdropFilter: 'blur(10px)',
                      border: isCenter ? '2px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {/* Image */}
                      <div style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <img
                          src={card.src}
                          alt="OBU Campus"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                        />
                      </div>

                      {/* Card Number Badge */}
                      {isCenter && (
                        <div style={{
                          position: 'absolute',
                          top: isMobile ? '12px' : '20px',
                          right: isMobile ? '12px' : '20px',
                          width: isMobile ? '40px' : '50px',
                          height: isMobile ? '40px' : '50px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)',
                          border: isMobile ? '2px solid white' : '3px solid white'
                        }}>
                          <span style={{
                            fontSize: isMobile ? '1rem' : '1.2rem',
                            fontWeight: 800,
                            color: '#1a1a2e',
                            fontFamily: 'Montserrat, sans-serif'
                          }}>
                            {String(currentIndex + 1).padStart(2, '0')}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="hidden sm:flex"
            style={{
              position: 'absolute',
              left: 'clamp(10px, 2vw, 20px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(50px, 8vw, 60px)',
              height: 'clamp(50px, 8vw, 60px)',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              zIndex: 100
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 0, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.8)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={window.innerWidth < 768 ? 24 : 32} color="white" strokeWidth={3} />
          </button>

          <button
            onClick={goToNext}
            className="hidden sm:flex"
            style={{
              position: 'absolute',
              right: 'clamp(10px, 2vw, 20px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(50px, 8vw, 60px)',
              height: 'clamp(50px, 8vw, 60px)',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              zIndex: 100
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 0, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.8)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={window.innerWidth < 768 ? 24 : 32} color="white" strokeWidth={3} />
          </button>
          
          {/* Mobile Navigation Buttons - Bottom positioned */}
          <div className="sm:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-100">
            <button
              onClick={goToPrev}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <ChevronLeft size={28} color="white" strokeWidth={3} />
            </button>
            <button
              onClick={goToNext}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <ChevronRight size={28} color="white" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center items-center gap-2 mt-8 md:mt-12 flex-wrap px-4">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: index === currentIndex ? 'clamp(30px, 6vw, 40px)' : 'clamp(8px, 1.5vw, 10px)',
                height: 'clamp(8px, 1.5vw, 10px)',
                borderRadius: '5px',
                background: index === currentIndex 
                  ? 'linear-gradient(90deg, #ffd700, #ffed4e)'
                  : 'rgba(255, 255, 255, 0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: index === currentIndex ? '0 2px 10px rgba(255, 215, 0, 0.5)' : 'none'
              }}
            />
          ))}
        </div>

        {/* Counter Display */}
        <div style={{
          textAlign: 'center',
          marginTop: 'clamp(1rem, 3vw, 2rem)',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: 600,
          color: 'white',
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '0.1em'
        }}>
          {String(currentIndex + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
