import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroImg from "../../assets/hero-campus.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
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
          className="text-gold-light font-body text-sm md:text-base tracking-[0.3em] uppercase mb-4"
        >
          Oda Bultum University — Student Services
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-5xl leading-tight"
        >
          <span className="gold-text">Welcome to OBU Student Services</span>
          <br />
          <span className="text-white/90 text-xl sm:text-2xl md:text-3xl font-body font-light mt-2 block">
            Your Home Away From Home
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-white/80 font-body text-lg md:text-xl mt-6"
        >
          Hi, <span className="text-gold font-semibold">Student</span> 👋
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-8 px-8 py-3.5 rounded-full font-body font-semibold text-sm tracking-wide
            bg-gradient-to-r from-gold to-gold-light text-foreground
            pulse-gold hover:scale-105 transition-transform duration-300 shadow-lg"
          onClick={() => document.getElementById("guidelines")?.scrollIntoView({ behavior: "smooth" })}
        >
          Explore Campus
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-gold-light" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
