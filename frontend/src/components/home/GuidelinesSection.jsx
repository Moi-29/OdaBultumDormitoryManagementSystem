import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BookOpen, Shield, Home, GraduationCap, Scale, AlertTriangle, UserX, Users, Ban, FileX } from "lucide-react";
import SectionWrapper from "../SectionWrapper";

const guidelines = [
  {
    title: "Dormitory Rules & Regulations",
    icon: Home,
    description: "Students must properly use and care for dormitory facilities. Maintain cleanliness, respect curfew regulations, and report maintenance issues promptly. Prohibited: unauthorized transfers, bringing unauthorized individuals, disturbing others, keeping illegal substances, alcohol, drugs, theft, fighting, and harassment.",
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Personal Conduct & Dignity",
    icon: UserX,
    description: "Prohibited on campus: possession or use of alcohol, drugs, khat, or entering premises intoxicated. Maintain appropriate dress code and hygiene. Prohibited: inappropriate sexual conduct, begging, sexual misconduct with staff, public displays of affection, same-sex activities, and suicide attempts.",
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Respect for Others",
    icon: Users,
    description: "Honor your roommate's space, belongings, and personal time. Cultural differences are celebrated. No verbal abuse, slander, threats, or harassment based on ethnicity, gender, religion, political belief, ability, race, or age. Respect all religions, languages, and cultures.",
    color: "from-pink-500 to-pink-600"
  },
  {
    title: "Communication & Conflict Resolution",
    icon: Shield,
    description: "Address concerns directly and kindly. Use conflict resolution services when needed. No anonymous harassment, defamatory literature, insults, name-calling, teasing, or character assassination. Respect disabled students and employees.",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    title: "Violence & Criminal Acts",
    icon: Ban,
    description: "Strictly prohibited: threatening or attacking employees, bullying, physical injury, maiming, attempted murder, abduction, false imprisonment, blackmail, extortion, unauthorized entry into residences, mutual combat, mobbing staff, and staging hunger strikes.",
    color: "from-red-500 to-red-600"
  },
  {
    title: "Academic Integrity & Honesty",
    icon: FileX,
    description: "Maintain academic integrity - no plagiarism, cheating, forgery, or fraud. Attend classes regularly, submit assignments on time, respect instructors. No disobeying invigilators, propagating exam theft rumors, or obtaining materials fraudulently.",
    color: "from-orange-500 to-orange-600"
  },
  {
    title: "Facility & Property Rules",
    icon: BookOpen,
    description: "Maintain shared spaces. Follow cleaning schedules. Report maintenance issues promptly. Respect library, classroom, and laboratory staff. No abusive language, coercing students, disobeying staff instructions, fighting, or damaging property.",
    color: "from-green-500 to-green-600"
  },
  {
    title: "Cooperation & Community",
    icon: Scale,
    description: "Share responsibilities fairly. Support your roommate during difficult times. Cooperate with dormitory proctors, security personnel, and all university staff. Participate in community activities and respect institutional policies.",
    color: "from-amber-500 to-amber-600"
  },
  {
    title: "Students Rights",
    icon: GraduationCap,
    description: "Freedom to learn, inquire, and develop skills. Access to safe environment with protected constitutional and human rights. Legal protection against discrimination. Participation in student unions. Access to food, dormitory, medical, and recreational services. Right to present evidence and defense.",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    title: "Academic Rules & Regulations",
    icon: BookOpen,
    description: "Follow academic rules and institutional policies. Register within specified periods. Attend classes regularly. Maintain minimum academic performance. Academic dishonesty results in disciplinary action. Grade reports issued each semester. Right to appeal academic decisions.",
    color: "from-teal-500 to-teal-600"
  },
  {
    title: "Penalties and Appeals",
    icon: AlertTriangle,
    description: "Violations result in: Oral warnings (first-time minor), Written warnings (permanent file), Suspension (immediate campus departure), or Expulsion (barred from re-enrollment). Appeals to University President within 5 working days. President's decision is final.",
    color: "from-yellow-500 to-yellow-600"
  },
];

const GuidelinesSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="guidelines" className="py-20 md:py-28 relative overflow-hidden bg-white">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-gradient-to-r from-gold to-yellow-500 text-white font-bold text-sm tracking-[0.2em] uppercase rounded-full shadow-lg">
              Campus Life
            </span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            Discipline & Campus Guidelines
          </h2>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            A respectful community starts with shared values. Review our comprehensive guidelines to ensure a safe, enriching, and harmonious campus experience for everyone.
          </p>

          {/* Decorative Line */}
          <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-8 max-w-md"></div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guidelines.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  delay: i * 0.08, 
                  duration: 0.5
                }}
                className="group relative"
              >
                {/* Card Glow Effect on Hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-300`}></div>
                
                {/* Card Content */}
                <div className="relative bg-white rounded-3xl p-8 h-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden hover:-translate-y-2">
                  {/* Subtle Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <div className={`w-full h-full bg-gradient-to-br ${item.color} rounded-full blur-2xl`}></div>
                  </div>

                  {/* Icon Container - No Animation */}
                  <div className="relative z-10">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="relative z-10 font-display text-2xl font-bold text-gray-900 mb-4 group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="relative z-10 text-gray-600 font-body text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Bottom Accent Line */}
                  <div className={`absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r ${item.color} transition-all duration-300`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gray-100 rounded-full border-2 border-gray-200 shadow-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-semibold">All guidelines are actively enforced</span>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default GuidelinesSection;
