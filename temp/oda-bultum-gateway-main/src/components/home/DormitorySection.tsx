import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Building2 } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import SectionWrapper from "@/components/SectionWrapper";

const overallStats = [
  { label: "Total Capacity", value: 6000, suffix: "" },
  { label: "Current Occupancy", value: 5100, suffix: "" },
  { label: "Occupancy Rate", value: 85, suffix: "%" },
];

const blocks = [
  { name: "Block A", rooms: 120, gender: "Male", status: "available" },
  { name: "Block B", rooms: 115, gender: "Male", status: "available" },
  { name: "Block C", rooms: 100, gender: "Female", status: "limited" },
  { name: "Block D", rooms: 95, gender: "Female", status: "available" },
  { name: "Building II", rooms: 140, gender: "Male", status: "limited" },
  { name: "Building III", rooms: 130, gender: "Male", status: "full" },
];

const statusConfig: Record<string, { label: string; classes: string }> = {
  available: { label: "Available", classes: "bg-emerald/10 text-emerald border-emerald/20" },
  limited: { label: "Limited", classes: "bg-gold/10 text-gold border-gold/30" },
  full: { label: "Full", classes: "bg-destructive/10 text-destructive border-destructive/20" },
};

const DormitorySection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper className="py-20 md:py-28 section-gradient">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Housing</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">Dormitory Availability</h2>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {overallStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className="glass-card p-6 text-center"
            >
              <div className="font-display text-3xl md:text-4xl text-primary mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={1500} />
              </div>
              <p className="text-muted-foreground font-body text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Block grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blocks.map((block, i) => {
            const config = statusConfig[block.status];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="glass-card p-5 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-lg text-foreground">{block.name}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-body border ${config.classes}`}>
                    {config.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-body text-muted-foreground">
                  <span>{block.rooms} Rooms</span>
                  <span>{block.gender}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default DormitorySection;
