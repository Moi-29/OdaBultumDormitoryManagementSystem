import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, Coffee, Utensils, Moon } from "lucide-react";
import SectionWrapper from "../SectionWrapper";
import { useTheme } from "../../context/ThemeContext";

const meals = [
  {
    title: "Breakfast",
    time: "12:30 – 1:00 AM LT",
    icon: Coffee,
    color: "from-gold to-gold-light",
    bgClass: "bg-gold/10",
    borderClass: "border-gold/20",
    desc: "Morning Essentials & Light Meals",
    samples: ["Tea & Coffee", "Bread & Butter", "Eggs", "Porridge", "Fresh Fruits"],
  },
  {
    title: "Lunch",
    time: "5:00 AM – 7:00 PM LT",
    icon: Utensils,
    color: "from-emerald to-emerald-light",
    bgClass: "bg-emerald/10",
    borderClass: "border-emerald/20",
    desc: "Traditional Ethiopian & Continental",
    samples: ["Injera with Wot", "Rice & Stew", "Pasta", "Fresh Salad", "Seasonal Fruits"],
  },
  {
    title: "Dinner",
    time: "11:00 – 1:00 PM LT",
    icon: Moon,
    color: "from-primary to-indigo-light",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/20",
    desc: "Hot Meals & Vegetarian Options",
    samples: ["Firfir", "Vegetable Stew", "Grilled Meat", "Soup", "Bread & Butter"],
  },
];

const CafeteriaSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { isDarkMode } = useTheme();

  return (
    <SectionWrapper className="py-20 md:py-28" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f9fafb', transition: 'background-color 0.3s ease' }}>
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Dining</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl" style={{ color: isDarkMode ? '#ffffff' : '#111827', transition: 'color 0.3s ease' }}>Cafeteria Schedule</h2>
          <p className="mt-3 font-body max-w-xl mx-auto" style={{ color: isDarkMode ? '#d1d5db' : '#6b7280', transition: 'color 0.3s ease' }}>
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

              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CafeteriaSection;
