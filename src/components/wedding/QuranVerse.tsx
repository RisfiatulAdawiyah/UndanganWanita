import { motion } from "framer-motion";
import { Wedding } from "@/types/wedding.types";

interface QuranVerseProps {
  wedding: Wedding;
}

const QuranVerse = ({ wedding }: QuranVerseProps) => {
  // Default verse (Ar-Rum: 21)
  const arabicText = wedding.main_verse_arabic || 
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً";
  
  const transliteration = wedding.main_verse_transliteration || 
    "Wa min aayaatihee an khalaqa lakum min anfusikum azwaajal litaskunoo ilaihaa wa ja'ala bainakum mawaddataw wa rahmah";
  
  const translation = wedding.main_verse_translation || 
    "And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.";
  
  const reference = wedding.main_verse_reference || "Ar-Rum: 21";
  return (
    <section className="section-spacing relative overflow-hidden bg-batik-pattern bg-batik-ornament" style={{ '--bg-color': '#1a5f4f' } as React.CSSProperties}>
      {/* Batik pattern border */}
      <div className="absolute top-0 left-0 right-0 batik-border-top" />
      
      <div className="max-w-2xl mx-auto text-center relative z-10 px-4">
        <div className="glass-container batik-frame batik-corners">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
          <p className="font-arabic text-2xl md:text-4xl leading-[2] text-foreground px-4" dir="rtl">
            {arabicText}
          </p>

          <div className="w-12 h-px bg-accent/30 mx-auto" />

          {transliteration && (
            <p className="font-body text-xs md:text-sm text-muted-foreground italic leading-relaxed px-6">
              "{transliteration}"
            </p>
          )}

          <p className="font-body text-sm text-foreground/80 leading-relaxed max-w-lg mx-auto px-6">
            "{translation}"
          </p>

          <p className="font-body text-xs text-accent tracking-[0.15em] uppercase font-medium">
            {reference}
          </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuranVerse;
