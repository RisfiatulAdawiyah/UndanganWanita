import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface MusicControlProps {
  musicUrl?: string | null;
}

const MusicControl = ({ musicUrl }: MusicControlProps) => {
  const [isMuted, setIsMuted] = useState(false); // Changed to false - autoplay
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (musicUrl && audioRef.current) {
      audioRef.current.volume = 0.3;
      
      // Auto play music after a short delay
      const playTimer = setTimeout(() => {
        audioRef.current?.play().catch((error) => {
          console.log("Autoplay prevented by browser:", error);
          // If autoplay is blocked, set to muted state
          setIsMuted(true);
        });
      }, 1500); // Delay 1.5s after component mounts

      return () => clearTimeout(playTimer);
    }
  }, [musicUrl]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  if (!musicUrl) return null;

  // Detect file type from URL
  const fileExtension = musicUrl.split('.').pop()?.toLowerCase();
  const isVideo = fileExtension === 'mp4';

  return (
    <>
      {isVideo ? (
        <audio ref={audioRef} loop>
          <source src={musicUrl} type="audio/mp4" />
        </audio>
      ) : (
        <audio ref={audioRef} loop>
          <source src={musicUrl} type="audio/mpeg" />
        </audio>
      )}
      
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full glass-card flex items-center justify-center
                       text-accent hover:bg-accent/10 transition-colors shadow-lg"
            onClick={toggleMusic}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isMuted ? "Play music" : "Pause music"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicControl;
