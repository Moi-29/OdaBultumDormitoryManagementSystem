import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Globe, Heart, Languages, Users, Handshake, Shield, Star, Award, BookOpen, Smile, Target, Zap } from "lucide-react";
import SectionWrapper from "../SectionWrapper";

const diversityCards = [
  {
    icon: Globe,
    title: "Cultural Exchange",
    description: "Experience rich cultural diversity through student-led events, traditional celebrations, and international food festivals that bring our global community together."
  },
  {
    icon: Handshake,
    title: "Inclusive Community",
    description: "We celebrate differences and create a welcoming environment where every student feels valued, respected, and empowered to be their authentic self."
  },
  {
    icon: Shield,
    title: "Zero Tolerance Policy",
    description: "Strict enforcement against discrimination, harassment, or prejudice based on ethnicity, religion, gender, ability, or any other characteristic."
  },
  {
    icon: Star,
    title: "Equal Opportunities",
    description: "All students have equal access to academic resources, extracurricular activities, leadership positions, and support services regardless of background."
  },
  {
    icon: Award,
    title: "Diversity Recognition",
    description: "Annual awards and recognition programs celebrate students who promote inclusivity, bridge cultural gaps, and champion diversity initiatives."
  },
  {
    icon: BookOpen,
    title: "Cultural Education",
    description: "Workshops, seminars, and training sessions help students understand different cultures, traditions, and perspectives to build mutual respect."
  },
  {
    icon: Smile,
    title: "Support Networks",
    description: "Dedicated support groups and mentorship programs connect students from similar backgrounds while encouraging cross-cultural friendships."
  },
  {
    icon: Target,
    title: "Inclusion Goals",
    description: "Continuous improvement of diversity metrics, representation in leadership, and accessibility features to ensure no one is left behind."
  },
  {
    icon: Zap,
    title: "Active Engagement",
    description: "Student-led diversity committees, cultural clubs, and advocacy groups actively work to promote understanding and celebrate our multicultural campus."
  },
  {
    icon: Heart,
    title: "Respect & Dignity",
    description: "Every interaction is guided by principles of mutual respect, human dignity, and the understanding that diversity makes us stronger together."
  },
  {
    icon: Users,
    title: "Unity in Action",
    description: "Collaborative projects and team activities intentionally mix students from different backgrounds to build lasting friendships and understanding."
  },
  {
    icon: Languages,
    title: "Language Support",
    description: "Multilingual resources, translation services, and language exchange programs ensure effective communication across all linguistic backgrounds."
  },
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

        {/* Diversity Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diversityCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                className="glass-card p-6 hover:scale-[1.03] transition-all duration-300 text-left"
              >
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, hsl(262, 85%, 34%), hsl(43, 72%, 52%))" }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {card.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </SectionWrapper>
  );
};

export default DiversitySection;
