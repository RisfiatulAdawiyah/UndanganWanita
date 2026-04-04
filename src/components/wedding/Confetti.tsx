import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const Confetti = ({ active, duration = 3000 }: ConfettiProps) => {
  const [pieces, setPieces] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    color: string;
    shape: string;
  }>>([]);

  useEffect(() => {
    if (active) {
      const colors = ['confetti-gold', 'confetti-emerald', 'confetti-white', 'confetti-pink'];
      const shapes = ['confetti-circle', 'confetti-square'];
      
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      }));

      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="confetti-container">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className={`confetti ${piece.color} ${piece.shape}`}
              style={{
                left: `${piece.left}%`,
                top: '-20px',
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y: window.innerHeight + 20,
                opacity: 0,
                rotate: 720,
              }}
              transition={{
                duration: 3,
                delay: piece.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;
