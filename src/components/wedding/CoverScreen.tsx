import { motion, AnimatePresence } from "framer-motion";
import heroImage from "@/assets/wedding-hero.jpg";
import couple1 from "@/assets/couple1.png";
import { Wedding } from "@/types/wedding.types";
import { getImageUrl } from "@/lib/localAssets";

interface CoverScreenProps {
  onOpen: () => void;
  isVisible: boolean;
  wedding: Wedding;
}

const CoverScreen = ({ onOpen, isVisible, wedding }: CoverScreenProps) => {
  const coverImage = wedding.cover_image_url ? getImageUrl(wedding.cover_image_url) : couple1;
  const weddingDate = new Date(wedding.wedding_date);
  const formattedDate = weddingDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          {/* Background */}
          <motion.div 
            className="absolute inset-0"
            exit={{ scale: 1.1 }}
            transition={{ duration: 1 }}
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
            <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" />
          </motion.div>

          {/* Content */}
          <motion.div
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <motion.p
              className="font-body text-sm tracking-[0.3em] uppercase text-primary-foreground/70 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Pernikahan
            </motion.p>

            <motion.h1
              className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {wedding.groom_name}
            </motion.h1>

            <motion.div
              className="flex items-center justify-center gap-4 my-4"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <span className="w-16 h-px bg-accent" />
              <span className="font-display text-2xl text-accent italic">&</span>
              <span className="w-16 h-px bg-accent" />
            </motion.div>

            <motion.h1
              className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {wedding.bride_name}
            </motion.h1>

            <motion.p
              className="font-body text-primary-foreground/60 text-sm mb-10 tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              {formattedDate}
            </motion.p>

            <motion.button
              onClick={onOpen}
              className="px-10 py-4 text-accent font-body text-sm tracking-[0.2em] uppercase
                         hover:bg-accent hover:text-primary-foreground transition-all duration-500
                         backdrop-blur-sm bg-accent/10 rounded-sm shadow-[0_4px_20px_rgba(212,175,55,0.2)]
                         animate-pulseGlow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              whileHover={{ scale: 1.08, boxShadow: "0 8px 30px rgba(212,175,55,0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Buka Undangan
            </motion.button>
          </motion.div>

          {/* Decorative corners */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-accent/40" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-accent/40" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-accent/40" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-accent/40" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoverScreen;
