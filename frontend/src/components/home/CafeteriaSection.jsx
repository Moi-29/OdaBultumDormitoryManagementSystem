import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, Coffee, Utensils, Moon } from "lucide-react";
import SectionWrapper from "../SectionWrapper";

const meals = [
  {
    title: "Breakfast",
    time: "12:30 – 1:00 AM LT",
    icon: Coffee,
    color: "from-gold to-gold-light",
    bgClass: "bg-gold/10",
    borderClass: "border-gold/20",
    desc: "Morning Essentials & Light Meals",
  },
  {
    title: "Lunch",
    time: "5:00 AM – 7:00 PM LT",
    icon: Utensils,
    color: "from-emerald to-emerald-light",
    bgClass: "bg-emerald/10",
    borderClass: "border-emerald/20",
    desc: "Traditional Ethiopian & Continental",
  },
  {
    title: "Dinner",
    time: "11:00 – 1:00 PM LT",
    icon: Moon,
    color: "from-primary to-indigo-light",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/20",
    desc: "Hot Meals & Vegetarian Options",
  },
];

const CafeteriaSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <SectionWrapper className="py-20 md:py-28 section-gradient">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Dining</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">Cafeteria Schedule</h2>
          <p className="text-muted-foreground mt-3 font-body max-w-xl mx-auto">
            Nutritious meals served daily to keep you energized and focused.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meals.map((meal, i) => {
            const Icon = meal.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6 md:p-8 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meal.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-1">{meal.title}</h3>
                <div className="flex items-center gap-2 text-muted-foreground font-body text-sm mb-3">
                  <Clock className="w-4 h-4" />
                  {meal.time}
                </div>
                <p className="text-muted-foreground font-body text-sm mb-4">{meal.desc}</p>
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-body text-muted-foreground mb-2 uppercase tracking-wider">Sample Menu</p>
                  <div className="flex flex-wrap gap-2">
                    {meal.samples.map((s, j) => (
                      <span key={j} className={`px-3 py-1 rounded-full text-xs font-body ${meal.bgClass} ${meal.borderClass} border text-foreground/80`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CafeteriaSection;
