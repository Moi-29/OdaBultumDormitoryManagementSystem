import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Stethoscope, Phone, Clock, Heart, Pill, Brain, CheckCircle } from "lucide-react";
import SectionWrapper from "../SectionWrapper";

const services = [
  { icon: Stethoscope, label: "General Check-ups" },
  { icon: Brain, label: "Mental Health Support" },
  { icon: Pill, label: "Pharmacy Services" },
  { icon: Heart, label: "Emergency Care" },
];

const HealthCenterSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <SectionWrapper className="py-20 md:py-28 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Wellness</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">Health Center</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl indigo-gradient flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-gold-light" />
              </div>
              <h3 className="font-display text-xl text-foreground">Campus Clinic</h3>
            </div>
            <p className="text-muted-foreground font-body mb-6">
              Free basic medical services including consultations, vaccinations, and emergency care.
              Our qualified staff is available 24/7 for urgent health needs.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-sm font-body text-foreground pulse-gold">
                <Phone className="w-4 h-4 text-destructive" />
                Emergency: 24/7
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/10 border border-emerald/20 text-sm font-body text-foreground">
                <Clock className="w-4 h-4 text-emerald" />
                Regular: 8AM – 6PM
              </div>
            </div>

            <div className="space-y-2">
              {["Free consultations for all students", "Qualified medical professionals", "Referral to hospitals when needed"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Services grid */}
          <div className="grid grid-cols-2 gap-4">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass-card p-6 text-center hover:scale-[1.03] transition-transform duration-300"
                >
                  <div className="w-12 h-12 rounded-xl emerald-gradient flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-body text-sm text-foreground font-medium">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default HealthCenterSection;
