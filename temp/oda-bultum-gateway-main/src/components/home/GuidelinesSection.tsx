import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronDown, CheckCircle, BookOpen, Shield, Home } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";

const guidelines = [
  {
    title: "Dormitory Rules & Regulations",
    icon: Home,
    items: [
      "Respect university property and maintain cleanliness",
      "No unauthorized gatherings or loud noise after 10 PM",
      "Visitors must register at the front desk",
      "Keep doors locked and valuables secured",
      "Report maintenance issues promptly",
    ],
  },
  {
    title: "Academic Conduct",
    icon: BookOpen,
    items: [
      "Maintain academic integrity — no plagiarism or cheating",
      "Attend all classes and submit assignments on time",
      "Respect instructors and fellow students",
      "Use library resources responsibly",
      "Follow exam hall regulations strictly",
    ],
  },
  {
    title: "Safety & Security",
    icon: Shield,
    items: [
      "Familiarize yourself with emergency exits and protocols",
      "Report suspicious activities immediately",
      "Carry your student ID at all times",
      "Follow fire safety and evacuation procedures",
      "Cooperate with security personnel during inspections",
    ],
  },
];

const GuidelinesSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <SectionWrapper id="guidelines" className="py-20 md:py-28 section-gradient">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Campus Life</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Discipline & Campus Guidelines
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto font-body">
            A respectful community starts with shared values. Review our guidelines to ensure a safe and enriching experience.
          </p>
        </motion.div>

        <div className="space-y-4">
          {guidelines.map((item, i) => {
            const Icon = item.icon;
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl indigo-gradient flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gold-light" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl text-foreground">{item.title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                        <ul className="space-y-3">
                          {item.items.map((rule, j) => (
                            <motion.li
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.08 }}
                              className="flex items-start gap-3 text-muted-foreground font-body text-sm md:text-base"
                            >
                              <CheckCircle className="w-4 h-4 text-emerald mt-0.5 shrink-0" />
                              {rule}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default GuidelinesSection;
