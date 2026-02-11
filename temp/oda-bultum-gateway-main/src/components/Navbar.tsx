import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Building2, FileText, AlertCircle } from "lucide-react";

const sidebarItems = [
  { icon: Building2, label: "Dormitory View" },
  { icon: FileText, label: "Application Form" },
  { icon: AlertCircle, label: "Report Issue" },
];

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
        style={{ boxShadow: "0 1px 30px hsl(43 72% 52% / 0.08)" }}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <span className="font-display text-lg text-primary">OBU Student Services</span>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-sm font-body font-medium text-foreground">
            <Home className="w-4 h-4 text-gold" />
            Home
          </button>

          <div className="w-10" />
        </div>
      </nav>

      {/* Sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-sidebar border-r border-sidebar-border p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-xl text-sidebar-primary">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                  <X className="w-5 h-5 text-sidebar-foreground" />
                </button>
              </div>

              <div className="space-y-2">
                {sidebarItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm
                        text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary transition-all duration-200"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
