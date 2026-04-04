import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useGalleryPhotos } from "@/hooks/useGallery";
import { getImageUrl } from "@/lib/localAssets";
import FloatingParticles from "./FloatingParticles";

interface PhotoGalleryProps {
  weddingId: string;
}

const PhotoGallery = ({ weddingId }: PhotoGalleryProps) => {
  const { data: photos = [], isLoading } = useGalleryPhotos(weddingId);
  const [selected, setSelected] = useState<number | null>(null);

  const navigate = (dir: number) => {
    if (selected === null) return;
    setSelected((selected + dir + photos.length) % photos.length);
  };

  if (isLoading) {
    return (
      <section className="section-spacing">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (photos.length === 0) return null;

  return (
    <section className="section-spacing relative overflow-hidden bg-batik-pattern bg-batik-ornament" style={{ '--bg-color': '#164d3f' } as React.CSSProperties}>
      {/* Floating particles effect */}
      <FloatingParticles />
      
      {/* Batik pattern border */}
      <div className="absolute top-0 left-0 right-0 batik-border-top" />
      
      <div className="max-w-5xl mx-auto relative z-10 px-4">
        <motion.div
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="section-subtitle">
            Momen Berharga
          </p>
          <h3 className="section-title text-gradient-gold">
            Galeri Kami
          </h3>
        </motion.div>

        <div className="glass-container batik-frame batik-corners">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 auto-rows-[180px] md:auto-rows-[240px]">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group smooth-transition hover-lift ${photo.span_class}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.5, type: "spring", stiffness: 100 }}
              onClick={() => setSelected(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={getImageUrl(photo.image_url)}
                alt={photo.alt_text || `Photo ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Tap indicator for mobile */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-lg p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <button
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-background/10 backdrop-blur-sm
                           flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                onClick={() => setSelected(null)}
              >
                <X className="w-5 h-5" />
              </button>

              <button
                className="absolute left-4 md:left-8 w-10 h-10 rounded-full bg-background/10 backdrop-blur-sm
                           flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                className="absolute right-4 md:right-8 w-10 h-10 rounded-full bg-background/10 backdrop-blur-sm
                           flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <motion.img
                key={selected}
                src={getImageUrl(photos[selected].image_url)}
                alt={photos[selected].alt_text || 'Photo'}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PhotoGallery;
