import { motion } from "framer-motion";
import { Heart, Sparkles, Star, Gift, PartyPopper, Calendar, MessageCircle, Camera } from "lucide-react";
import { useLoveStories } from "@/hooks/useLoveStory";

interface LoveStoryTimelineProps {
  weddingId: string;
}

const iconMap: Record<string, any> = {
  heart: Heart,
  sparkles: Sparkles,
  star: Star,
  gift: Gift,
  'party-popper': PartyPopper,
  calendar: Calendar,
  'message-circle': MessageCircle,
  camera: Camera,
};

const LoveStoryTimeline = ({ weddingId }: LoveStoryTimelineProps) => {
  const { data: events = [], isLoading } = useLoveStories(weddingId);

  if (isLoading) {
    return (
      <section className="section-spacing bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;
  return (
    <section className="section-spacing relative overflow-hidden bg-batik-pattern bg-batik-ornament" style={{ '--bg-color': '#164d3f' } as React.CSSProperties}>
      {/* Batik pattern border */}
      <div className="absolute top-0 left-0 right-0 batik-border-top" />
      
      <div className="max-w-2xl mx-auto relative z-10 px-4">
        <motion.div
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="section-subtitle">
            Perjalanan Kami
          </p>
          <h3 className="section-title text-gradient-gold">
            Kisah Cinta
          </h3>
        </motion.div>

        <div className="glass-container batik-frame batik-corners">
          <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/10 via-accent/40 to-accent/10" />

          {events.map((event, i) => {
            const Icon = iconMap[event.icon] || Heart;
            return (
              <motion.div
                key={i}
                className={`relative flex items-start mb-14 last:mb-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {/* Icon dot */}
                <motion.div
                  className="absolute left-7 md:left-1/2 -translate-x-1/2 z-10 mt-1"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <div className="w-10 h-10 rounded-full bg-background border-2 border-accent/50 flex items-center justify-center
                                  shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                </motion.div>

                {/* Content card */}
                <div className={`ml-16 md:ml-0 md:w-[calc(50%-2.5rem)] ${i % 2 === 0 ? "md:pr-6 md:text-right" : "md:pl-6"}`}>
                  <div className="glass-card rounded-xl p-5 md:p-6 smooth-transition hover-lift shimmer-effect">
                    <span className="font-body text-[10px] text-accent tracking-[0.2em] uppercase font-medium">{event.date}</span>
                    <h4 className="font-display text-xl text-foreground mt-2 mb-2">{event.title}</h4>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Heart at bottom */}
          <motion.div
            className="absolute left-7 md:left-1/2 -translate-x-1/2 -bottom-2"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Heart className="w-5 h-5 text-accent fill-accent" />
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoveStoryTimeline;
