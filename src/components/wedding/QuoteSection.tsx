import { motion } from "framer-motion";
import { Wedding } from "@/types/wedding.types";

interface QuoteSectionProps {
  wedding: Wedding;
}

const QuoteSection = ({ wedding }: QuoteSectionProps) => {
  // Default quote (An-Naba: 8)
  const arabicText = wedding.quote_verse_arabic || "وَخَلَقْنَاكُمْ أَزْوَاجًا";
  const translation = wedding.quote_verse_translation || "And We created you in pairs.";
  const reference = wedding.quote_verse_reference || "An-Naba: 8";
  return (
    <section className="section-spacing relative overflow-hidden bg-batik-pattern bg-batik-ornament" style={{ '--bg-color': '#164d3f' } as React.CSSProperties}>
      {/* Batik pattern border */}
      <div className="absolute top-0 left-0 right-0 batik-border-top" />
      
      <div className="max-w-xl mx-auto text-center relative z-10 px-4">
        <div className="glass-container batik-frame batik-corners">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
        <p className="font-arabic text-xl text-accent/80 mb-6" dir="rtl">
          {arabicText}
        </p>
        <p className="font-display text-2xl md:text-3xl text-foreground italic leading-relaxed mb-6">
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

export default QuoteSection;
