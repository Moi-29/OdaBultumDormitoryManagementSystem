import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Globe, Heart, Languages, Users } from "lucide-react";
import AnimatedCounter from "../AnimatedCounter";
import SectionWrapper from "../SectionWrapper";

const stats = [
  { icon: Users, value: 50, suffix: "+", label: "Ethnicities Represented" },
  { icon: Languages, value: 15, suffix: "+", label: "Languages Spoken" },
  { icon: Heart, value: 100, suffix: "%", label: "Respect Guaranteed" },
];

const DiversitySection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

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
          <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Our Strength</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Unity in Diversity
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto mb-12">
            We foster inclusivity and maintain zero tolerance for discrimination. Every student belongs here.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="glass-card p-8 hover:scale-[1.03] transition-all duration-300"
              >
                <motion.div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, hsl(262, 85%, 34%), hsl(43, 72%, 52%))" }}
                  animate={inView ? { scale: [0, 1.1, 1] } : {}}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
                <div className="font-display text-4xl text-primary mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-muted-foreground font-body text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>


      </div>
    </SectionWrapper>
  );
};

export default DiversitySection;
