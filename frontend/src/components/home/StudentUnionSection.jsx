import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, Calendar, Star, Lightbulb, Heart, Award, Rocket } from "lucide-react";
import AnimatedCounter from "../AnimatedCounter";
import SectionWrapper from "../SectionWrapper";

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Active Members" },
  { icon: Calendar, value: 20, suffix: "+", label: "Annual Events" },
  { icon: Star, value: 4.9, suffix: "/5", label: "Impact Score", decimals: 1 },
];

const values = [
  { icon: Heart, title: "Unity", desc: "Building bridges across communities" },
  { icon: Award, title: "Excellence", desc: "Promoting growth and high standards" },
  { icon: Users, title: "Service", desc: "Serving with integrity and purpose" },
  { icon: Rocket, title: "Innovation", desc: "Creating opportunities for all" },
];

const StudentUnionSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <SectionWrapper className="py-20 md:py-28 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Community</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">Student Union</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto font-body">
            Empowering students through leadership, unity, and shared purpose.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-8 text-center hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="w-14 h-14 rounded-2xl indigo-gradient flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-gold-light" />
                </div>
                <div className="font-display text-4xl md:text-5xl text-primary mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                </div>
                <p className="text-muted-foreground font-body text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.12 }}
                className="glass-card p-6 text-center group hover:scale-[1.03] transition-all duration-300 cursor-default"
              >
                <div className="w-12 h-12 rounded-full emerald-gradient flex items-center justify-center mx-auto mb-3
                  group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-gold-light" />
                </div>
                <h4 className="font-display text-lg text-foreground mb-1">{v.title}</h4>
                <p className="text-muted-foreground font-body text-sm">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>


      </div>
    </SectionWrapper>
  );
};

export default StudentUnionSection;
