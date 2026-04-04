import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import islamicPattern from "@/assets/islamic-pattern.png";
import { Wedding } from "@/types/wedding.types";

interface ClosingSectionProps {
  wedding: Wedding;
}

const ClosingSection = ({ wedding }: ClosingSectionProps) => {
  const weddingDate = new Date(wedding.wedding_date);
  const formattedDate = weddingDate.toLocaleDateString('en-US', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).split('/').join(' . ');
  return (
    <section className="section-spacing relative overflow-hidden bg-batik-pattern bg-batik-ornament" style={{ '--bg-color': '#1a5f4f' } as React.CSSProperties}>
      {/* Batik pattern border */}
      <div className="absolute top-0 left-0 right-0 batik-border-top" />
      
      {/* Decorative pattern */}
      <img
        src={islamicPattern}
        alt=""
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] opacity-[0.06] pointer-events-none rotate-180 animate-float"
        style={{ filter: 'brightness(0.6) sepia(0.8) hue-rotate(10deg) saturate(1.5)' }}
        loading="lazy"
        width={800}
        height={800}
      />

      <div className="max-w-lg mx-auto text-center relative z-10 px-4">
        <div className="glass-container batik-frame batik-corners">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
        <p className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-6">
          Terima Kasih
        </p>

        <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4 leading-relaxed">
          Kami akan merasa terhormat dengan kehadiran Anda
        </h3>

        <p className="font-body text-sm text-muted-foreground/70 mb-10 leading-relaxed max-w-sm mx-auto">
          Kehadiran dan doa Anda sangat berarti bagi kami di hari yang penuh berkah ini.
        </p>

        <div className="glass-card rounded-2xl p-8 inline-block smooth-transition hover-lift animate-pulseGlow">
          <div className="space-y-2 mb-6">
            {wedding.groom_father && (
              <p className="font-body text-sm text-muted-foreground">
                Keluarga dari <span className="text-foreground font-medium">{wedding.groom_father}</span>
                {wedding.groom_mother && ` & ${wedding.groom_mother}`}
              </p>
            )}
            <p className="font-body text-xs text-accent">&</p>
            {wedding.bride_father && (
              <p className="font-body text-sm text-muted-foreground">
                Keluarga dari <span className="text-foreground font-medium">{wedding.bride_father}</span>
                {wedding.bride_mother && ` & ${wedding.bride_mother}`}
              </p>
            )}
          </div>

          <div className="w-16 h-px bg-accent/30 mx-auto mb-6" />

          <p className="font-display text-xl text-foreground italic mb-2">
            {wedding.groom_name} & {wedding.bride_name}
          </p>
          <p className="font-body text-xs text-muted-foreground tracking-[0.15em]">
            {formattedDate}
          </p>
        </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClosingSection;
