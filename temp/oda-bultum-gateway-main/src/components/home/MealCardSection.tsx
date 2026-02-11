import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CreditCard, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";

const steps = [
  "Visit the Student Services Office",
  "Bring your student ID and proof of enrollment",
  "Complete the registration form",
  "Receive your meal card (free of charge)",
  "Start using it immediately",
];

const benefits = [
  "Access all campus cafeterias",
  "Free meals — no payment required",
  "No cash needed",
  "Track your meal usage",
  "Government-funded for all students",
  "Valid for entire semester",
];

const notes = [
  "Card is non-transferable — keep it safe",
  "Report lost card immediately for replacement",
  "Meals are fully covered by the government",
  "Card expires at end of semester — renew each term",
  "No fees or deposits required",
];

const MealCardSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper className="py-20 md:py-28 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Services</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">Meal Card Information</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* How to Get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl indigo-gradient flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gold-light" />
              </div>
              <h3 className="font-display text-xl text-foreground">How to Get</h3>
            </div>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 font-body text-sm text-muted-foreground"
                >
                  <span className="w-6 h-6 rounded-full indigo-gradient text-gold-light flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-xl text-foreground">Benefits</h3>
            </div>
            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-3 font-body text-sm text-muted-foreground"
                >
                  <CheckCircle className="w-4 h-4 text-emerald shrink-0" />
                  {b}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-display text-xl text-foreground">Important Notes</h3>
            </div>
            <ul className="space-y-3">
              {notes.map((n, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-start gap-3 font-body text-sm text-muted-foreground"
                >
                  <ArrowRight className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  {n}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default MealCardSection;
