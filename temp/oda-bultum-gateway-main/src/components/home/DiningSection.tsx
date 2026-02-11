import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, ShieldCheck, Leaf, CheckCircle, Quote } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import SectionWrapper from "@/components/SectionWrapper";
import foodImg from "@/assets/food-dining.jpg";

const badges = [
  "Hygienic Preparation",
  "Balanced Nutrition",
  "Vegetarian & Vegan",
  "Halal Certified",
  "Regular Inspections",
];

const testimonials = [
  { text: "Food quality has really improved! Love the variety.", author: "3rd Year Student" },
  { text: "The cafeteria feels like a real restaurant now.", author: "2nd Year Student" },
  { text: "Healthy options available every day — great initiative!", author: "Graduate Student" },
];

const DiningSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <SectionWrapper className="py-20 md:py-28 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Quality</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Exceptional Dining Experience
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image + Rating */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={foodImg} alt="Dining experience" className="w-full h-72 md:h-96 object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute -bottom-4 -right-4 glass-card px-5 py-3 flex items-center gap-2 shadow-lg"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <span className="font-display text-xl text-foreground">
                <AnimatedCounter end={4.7} decimals={1} />
              </span>
              <span className="text-muted-foreground font-body text-xs">/5</span>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            {/* Testimonial */}
            <div className="glass-card p-6 mb-6">
              <Quote className="w-6 h-6 text-gold mb-3" />
              <p className="font-body text-foreground italic mb-2">"{testimonials[0].text}"</p>
              <p className="font-body text-sm text-muted-foreground">— {testimonials[0].author}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-body"
                >
                  <CheckCircle className="w-4 h-4 text-emerald" />
                  {badge}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default DiningSection;
