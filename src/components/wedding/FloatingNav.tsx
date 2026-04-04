import { useState, useEffect } from "react";
import { Home, Calendar, Heart, Gift, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingNav = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(true); // Changed to true - always visible

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = ["hero", "event", "story", "rsvp", "gift"];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  const navItems = [
    { id: "hero", icon: Home, label: "Home" },
    { id: "story", icon: Heart, label: "Story" },
    { id: "event", icon: Calendar, label: "Event" },
    { id: "gift", icon: Gift, label: "Gift" },
    { id: "rsvp", icon: MessageSquare, label: "RSVP" },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="floating-nav"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 150 }}
        >
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              className={`floating-nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => scrollToSection(item.id)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.8 + index * 0.08 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;
