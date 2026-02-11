import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronDown, CheckCircle, BookOpen, Shield, Home, GraduationCap, Scale, AlertTriangle } from "lucide-react";
import SectionWrapper from "../SectionWrapper";

const guidelines = [
  {
    title: "Dormitory Rules & Regulations",
    icon: Home,
    items: [
      "Students assigned to dormitories must properly use and care for the dormitory rooms and facilities given to them.",
      "Students are responsible for maintaining cleanliness inside their rooms and in shared areas.",
      "Damaging dormitory property intentionally or through negligence is strictly prohibited.",
      "Any student who damages property will be required to pay for the damage and may face disciplinary measures.",
      "Transferring from one dormitory room to another without official permission is not allowed.",
      "Bringing unauthorized individuals into dormitory rooms is prohibited.",
      "Activities that disturb the peace and comfort of other residents are forbidden.",
      "Keeping materials or substances that are illegal or dangerous inside dormitories is strictly prohibited.",
      "Students must follow dormitory curfew and entry/exit regulations set by the institution.",
      "Use of alcohol, drugs, or other prohibited substances inside the dormitory is forbidden.",
      "Theft or attempting to steal within the dormitory will result in strict disciplinary action.",
      "Physical fighting, harassment, or threatening behavior toward other residents is prohibited.",
      "Students must cooperate with dormitory proctors and administrators.",
      "Regular inspections of rooms may be conducted in accordance with dormitory regulations.",
      "Students must properly use water, electricity, and other shared resources responsibly.",
      "Cooking inside rooms, unless in designated areas, is not allowed.",
      "Posting unauthorized notices or materials on dormitory walls is prohibited.",
      "Students must report maintenance issues or damages to the appropriate dormitory authority.",
      "Violating dormitory regulations may lead to warnings, suspension from the dormitory, or other disciplinary measures.",
      "Serious violations may result in removal from the dormitory and further institutional action.",
      "All dormitory residents are required to respect institutional policies and community living standards.",
      "These dormitory rules shall be implemented and enforced by the institution.",
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
  {
    title: "Students Right",
    icon: Scale,
    items: [
      "Freedom to learn, inquire, and develop skills according to the university calendar.",
      "Access to a safe environment where constitutional and human rights are protected.",
      "Legal protection against any form of discrimination or harassment.",
      "Participation in student unions and university leadership meetings through representatives.",
      "Access to food, dormitory, medical, and recreational services for regular students who have signed cost-sharing agreements.",
      "The right to present evidence and defense when accused of an offense.",
    ],
  },
  {
    title: "Academic Rules & Regulations",
    icon: GraduationCap,
    items: [
      "Any student who registers properly and begins classes shall follow the academic rules and regulations of the institution. Students are required to respect institutional policies and fulfill academic responsibilities.",
      "A student who fails to register within the specified registration period will not be allowed to attend classes unless special permission is granted.",
      "A student who withdraws from courses without following official procedures will not receive academic credit for those courses.",
      "Students must attend classes regularly. Absence beyond the permitted limit may result in academic penalties.",
      "Continuous assessment results, assignments, and examinations shall be evaluated according to the institution's grading policy.",
      "A student who fails examinations due to acceptable and documented reasons may be allowed to sit for a makeup examination.",
      "Academic dishonesty, including cheating or plagiarism, will result in disciplinary action according to institutional rules.",
      "Students must maintain the minimum required academic performance to remain in good standing.",
      "A student whose academic performance falls below the required standard may be placed on academic warning or probation.",
      "A student who remains on academic probation for consecutive semesters without improvement may be dismissed from the institution.",
      "A student has the right to formally appeal academic decisions following established procedures.",
      "Students are required to comply with academic legislation and institutional directives at all times.",
      "Academic records must be properly maintained according to institutional policy.",
      "A Grade Report shall be officially issued to students at the end of each semester.",
      "The Grade Report will include course grades, semester performance, and cumulative academic status.",
      "Students who wish to obtain official documents must follow proper request procedures and fulfill necessary requirements.",
    ],
  },
  {
    title: "Penalties and Appeals",
    icon: AlertTriangle,
    items: [
      "Oral Warnings: For first-time minor disturbances.",
      "Written Warnings: Kept in the student's permanent file.",
      "Suspension: The student must leave the campus immediately and surrender their ID card.",
      "Expulsion: The student is barred from re-enrolling in that specific institution or, in severe cases, any public university for a specified duration.",
      "A student dissatisfied with a disciplinary decision has the right to appeal to the University President or the designated Appeals Committee.",
      "Appeals must be submitted within 5 (five) working days of the decision.",
      "The decision of the President on the appeal shall be final.",
    ],
  },
];

const GuidelinesSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
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
