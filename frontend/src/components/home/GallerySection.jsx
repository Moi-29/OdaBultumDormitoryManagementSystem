import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const galleryImages = [
  { src: im, title: "Campus Life", description: "Experience the vibrant student community at Oda Bultum University" },
  { src: im1, title: "Modern Facilities", description: "State-of-the-art infrastructure designed for excellence in education" },
  { src: im2, title: "Academic Excellence", description: "Dedicated spaces for learning, research, and innovation" },
  { src: im3, title: "Student Activities", description: "Engaging programs that foster personal and professional growth" },
  { src: im4, title: "Campus Grounds", description: "Beautiful green spaces perfect for study and relaxation" },
  { src: im5, title: "Learning Spaces", description: "Collaborative environments that inspire creativity and knowledge" },
  { src: im6, title: "University Events", description: "Celebrating achievements and building lasting memories together" },
  { src: im7, title: "Student Services", description: "Comprehensive support systems for your academic journey" },
  { src: im8, title: "Campus Architecture", description: "Modern design meets functional excellence in every building" },
  { src: im9, title: "Community Spirit", description: "A diverse and inclusive environment where everyone belongs" },
  { src: im10, title: "Research Facilities", description: "Advanced laboratories and equipment for groundbreaking discoveries" },
  { src: im11, title: "Sports & Recreation", description: "Promoting health, wellness, and team spirit through athletics" },
  { src: im12, title: "Library Resources", description: "Extensive collections and quiet study areas for academic success" },
  { src: im13, title: "Cultural Events", description: "Celebrating diversity through art, music, and cultural programs" },
  { src: im15, title: "Innovation Hub", description: "Where ideas transform into reality through collaboration" },
  { src: im16, title: "Student Housing", description: "Comfortable and secure dormitories that feel like home" },
  { src: im17, title: "Dining Services", description: "Nutritious meals and diverse cuisine options for every taste" },
  { src: im18, title: "Technology Center", description: "Cutting-edge computing resources for the digital age" },
  { src: im19, title: "Outdoor Spaces", description: "Scenic pathways and gathering areas across campus" },
  { src: im20, title: "Academic Support", description: "Tutoring and mentorship programs for student success" },
  { src: im21, title: "Campus Security", description: "24/7 safety measures ensuring a secure learning environment" },
  { src: im22, title: "Future Ready", description: "Preparing tomorrow's leaders through quality education today" }
];

const GallerySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const currentImage = galleryImages[currentIndex];

  return (
    <section 
      className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-background to-background-dark"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gold-text">Campus Gallery</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the beauty and vibrancy of life at Oda Bultum University
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          }}
        >
          {/* Curved Wave Mask Effect */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
            >
              <defs>
                <clipPath id="waveClip">
                  <motion.path
                    d="M0,0 L1000,0 L1000,600 Q750,550 500,600 T0,600 Z"
                    animate={isHovered ? {
                      d: [
                        "M0,0 L1000,0 L1000,600 Q750,550 500,600 T0,600 Z",
                        "M0,0 L1000,0 L1000,600 Q750,650 500,600 T0,600 Z",
                        "M0,0 L1000,0 L1000,600 Q750,550 500,600 T0,600 Z"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Image Container with Clip Path */}
          <div className="absolute inset-0" style={{ clipPath: "url(#waveClip)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img
                  src={currentImage.src}
                  alt={currentImage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text Content Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 lg:px-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl"
              >
                <motion.h3
                  className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentImage.title}
                </motion.h3>
                
                <motion.div
                  className="w-24 h-1 bg-gold mb-6"
                  initial={{ width: 0 }}
                  animate={{ width: 96 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                />
                
                <motion.p
                  className="text-lg md:text-xl text-gray-200 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {currentImage.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-gold"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          {/* Image Counter */}
          <div className="absolute top-8 right-8 z-30 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white font-semibold">
              {currentIndex + 1} / {galleryImages.length}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
