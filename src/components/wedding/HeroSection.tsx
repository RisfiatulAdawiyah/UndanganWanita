import { motion, useScroll, useTransform } from "framer-motion";
import islamicPattern from "@/assets/islamic-pattern.png";
import { Wedding } from "@/types/wedding.types";
import FloatingParticles from "./FloatingParticles";
import { getImageUrl } from "@/lib/localAssets";
import heroImage from "@/assets/wedding-hero.jpg";

interface HeroSectionProps {
  wedding: Wedding;
}

const HeroSection = ({ wedding }: HeroSectionProps) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.2]);
  
  const weddingDate = new Date(wedding.wedding_date);
  const formattedDate = weddingDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const backgroundImage = wedding.hero_image_url 
    ? getImageUrl(wedding.hero_image_url)
    : heroImage;
  
  const venue = wedding.resepsi_venue || wedding.akad_venue || 'Wedding Venue';
  const address = wedding.resepsi_address || wedding.akad_address || '';
  return (
    <section className="relative min-h-screen flex items-center justify-center py-12 md:py-20 px-4 overflow-hidden bg-batik-pattern bg-batik-ornament" style={{ '--bg-color': '#1a5f4f' } as React.CSSProperties}>
      {/* Floating particles effect */}
      <FloatingParticles />
      
      {/* Background image with parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ scale }}
      >
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
      </motion.div>
      
      {/* Batik pattern border top */}
      <div className="absolute top-0 left-0 right-0 batik-border-top z-10" />
      
      {/* Batik pattern border bottom */}
      <div className="absolute bottom-0 left-0 right-0 batik-border-top z-10" />
      
      {/* Decorative pattern */}
      <img
        src={islamicPattern}
        alt=""
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] opacity-[0.08] pointer-events-none animate-float z-10"
        style={{ filter: 'brightness(0.6) sepia(0.8) hue-rotate(10deg) saturate(1.5)' }}
        loading="lazy"
        width={800}
        height={800}
      />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <motion.p
          className="font-arabic text-lg text-accent mb-4 drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ opacity }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </motion.p>

        <motion.p
          className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-6 drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ opacity }}
        >
          Kami mengundang Anda untuk merayakan
        </motion.p>

        <motion.h2
          className="font-display text-5xl md:text-7xl text-foreground mb-2 text-gradient-gold drop-shadow-[0_4px_12px_rgba(212,175,55,0.3)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
        >
          {wedding.groom_name}
        </motion.h2>

        <motion.div
          className="flex items-center justify-center gap-6 my-4"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 200 }}
        >
          <motion.span 
            className="font-display text-5xl text-glow-gold italic animate-smoothBounce drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            &
          </motion.span>
        </motion.div>

        <motion.h2
          className="font-display text-5xl md:text-7xl text-foreground mb-6 text-gradient-gold drop-shadow-[0_4px_12px_rgba(212,175,55,0.3)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
        >
          {wedding.bride_name}
        </motion.h2>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{ opacity }}
        >
          <p className="font-body text-muted-foreground text-sm tracking-wider drop-shadow-sm">
            {formattedDate}
          </p>
          {venue && (
            <p className="font-body text-muted-foreground/70 text-sm drop-shadow-sm">
              {venue}{address && `, ${address.split(',')[0]}`}
            </p>
          )}
        </motion.div>
      </div>

      {/* Bottom decoration with gold tint */}
      <img
        src={islamicPattern}
        alt=""
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] opacity-[0.06] pointer-events-none rotate-180 animate-float-delayed z-10"
        style={{ filter: 'brightness(0.3) sepia(1) hue-rotate(10deg) saturate(3)' }}
        loading="lazy"
        width={800}
        height={800}
      />
      
      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
