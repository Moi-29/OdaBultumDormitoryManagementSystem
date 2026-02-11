import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Droplets, CheckCircle } from "lucide-react";
import SectionWrapper from "../SectionWrapper";
import { useTheme } from "../../context/ThemeContext";

const features = ["Filtered", "Tested Daily", "24/7 Access"];

const CleanWaterSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { isDarkMode } = useTheme();

  return (
    <SectionWrapper className="py-20 md:py-28" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f9fafb', transition: 'background-color 0.3s ease' }}>
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="glass-card p-8 md:p-12 text-center relative overflow-hidden"
        >
          {/* Wave background */}
          <div className="absolute inset-0 opacity-5">
            <svg viewBox="0 0 1200 200" className="absolute bottom-0 w-full water-wave">
              <path d="M0,100 C300,180 600,20 900,100 C1050,140 1150,80 1200,100 L1200,200 L0,200 Z" fill="hsl(190, 72%, 21%)" />
            </svg>
          </div>

          <motion.div
            animate={inView ? { scale: [0, 1.2, 1] } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(190, 80%, 45%), hsl(190, 72%, 21%))" }}
          >
            <Droplets className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="font-display text-3xl md:text-4xl mb-3" style={{ color: isDarkMode ? '#ffffff' : '#111827', transition: 'color 0.3s ease' }}>Clean Water 24/7</h2>
          <p className="font-body max-w-lg mx-auto mb-8" style={{ color: isDarkMode ? '#d1d5db' : '#6b7280', transition: 'color 0.3s ease' }}>
            Safe, filtered drinking water available throughout all dormitories, regularly tested for your health and safety.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm
                  bg-emerald/10 border border-emerald/20 text-foreground"
              >
                <CheckCircle className="w-4 h-4 text-emerald" />
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default CleanWaterSection;
