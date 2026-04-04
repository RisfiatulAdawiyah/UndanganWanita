import { motion } from "framer-motion";
import { MapPin, Clock, Calendar } from "lucide-react";
import { Wedding } from "@/types/wedding.types";

interface EventDetailsProps {
  wedding: Wedding;
}

const EventDetails = ({ wedding }: EventDetailsProps) => {
  // Helper function to generate map embed from Google Maps URL
  const generateMapEmbed = (mapUrl: string, venue: string, address: string) => {
    if (!mapUrl || mapUrl === 'https://maps.google.com') {
      // Fallback: use venue + address for search
      if (venue) {
        const searchQuery = encodeURIComponent(`${venue}, ${address}`);
        return `<iframe src="https://maps.google.com/maps?q=${searchQuery}&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
      }
      return null;
    }
    
    try {
      // Extract coordinates from Google Maps URL
      const coordMatch = mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      const placeMatch = mapUrl.match(/place\/([^/]+)/);
      
      if (coordMatch) {
        const [, lat, lng] = coordMatch;
        return `<iframe src="https://maps.google.com/maps?q=${lat},${lng}&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
      } else if (placeMatch) {
        const placeName = placeMatch[1].replace(/\+/g, ' ');
        return `<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
      } else {
        // Try to extract query from URL
        const urlObj = new URL(mapUrl);
        const query = urlObj.searchParams.get('q');
        if (query) {
          return `<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
        }
      }
    } catch (error) {
      // If URL parsing fails, use venue + address as fallback
      console.warn('Failed to parse map URL:', error);
    }
    
    // Final fallback: use venue name
    const searchQuery = encodeURIComponent(`${venue}, ${address}`);
    return `<iframe src="https://maps.google.com/maps?q=${searchQuery}&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  };

  const events = [];

  // Add Akad if exists
  if (wedding.akad_date && wedding.akad_venue) {
    const akadDate = new Date(wedding.akad_date);
    const akadEnd = wedding.akad_end ? new Date(wedding.akad_end) : null;
    
    events.push({
      title: "Akad Nikah",
      subtitle: "Pernikahan Suci",
      date: akadDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: `${akadDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      })} ${akadEnd ? `– ${akadEnd.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      })}` : ''} WIB`,
      venue: wedding.akad_venue,
      address: wedding.akad_address || '',
      mapUrl: wedding.akad_maps_url || 'https://maps.google.com',
      mapEmbed: wedding.akad_maps_embed || generateMapEmbed(wedding.akad_maps_url || '', wedding.akad_venue, wedding.akad_address || ''),
    });
  }

  // Add Resepsi if exists
  if (wedding.resepsi_date && wedding.resepsi_venue) {
    const resepsiDate = new Date(wedding.resepsi_date);
    const resepsiEnd = wedding.resepsi_end ? new Date(wedding.resepsi_end) : null;
    
    events.push({
      title: "Walimatul Urs",
      subtitle: "Resepsi Pernikahan",
      date: resepsiDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: `${resepsiDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      })} ${resepsiEnd ? `– ${resepsiEnd.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      })}` : ''} WIB`,
      venue: wedding.resepsi_venue,
      address: wedding.resepsi_address || '',
      mapUrl: wedding.resepsi_maps_url || 'https://maps.google.com',
      mapEmbed: wedding.resepsi_maps_embed || generateMapEmbed(wedding.resepsi_maps_url || '', wedding.resepsi_venue, wedding.resepsi_address || ''),
    });
  }

  if (events.length === 0) return null;
  return (
    <section className="section-spacing relative overflow-hidden bg-batik-pattern bg-batik-ornament" style={{ '--bg-color': '#164d3f' } as React.CSSProperties}>
      {/* Batik pattern border */}
      <div className="absolute top-0 left-0 right-0 batik-border-top" />
      
      <div className="max-w-4xl mx-auto relative z-10 px-4">
        <motion.div
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="section-subtitle">
            Simpan Tanggalnya
          </p>
          <h3 className="section-title text-gradient-gold">
            Detail Acara
          </h3>
        </motion.div>

        <div className="glass-container batik-frame batik-corners">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {events.map((event, i) => (
              <motion.div
                key={i}
                className="glass-card rounded-2xl p-8 md:p-10 text-center smooth-transition-slow hover-lift shimmer-effect"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02 }}
              >
              {/* Title */}
              <h4 className="font-display text-2xl md:text-3xl text-foreground mb-1">{event.title}</h4>
              <p className="font-body text-[10px] text-accent tracking-[0.3em] uppercase font-medium mb-8">{event.subtitle}</p>

              <div className="space-y-5 mb-10">
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <span className="font-body text-sm">{event.date}</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <span className="font-body text-sm">{event.time}</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <span className="font-body text-sm block text-foreground/80">{event.venue}</span>
                    <span className="font-body text-xs text-muted-foreground/60">{event.address}</span>
                  </div>
                </div>
              </div>

              {/* Map embed - only show if proper embed code exists */}
              {event.mapEmbed && (
                <motion.div 
                  className="relative rounded-2xl overflow-hidden mb-6 shadow-[0_4px_20px_rgba(26,95,79,0.15)] group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Batik border decoration */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-accent/20 pointer-events-none z-10" />
                  
                  {/* Map container */}
                  <div 
                    dangerouslySetInnerHTML={{ __html: event.mapEmbed }}
                    className="w-full h-64 md:h-80 
                               [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0
                               [&>iframe]:grayscale-[0.3] [&>iframe]:opacity-90 
                               group-hover:[&>iframe]:grayscale-0 group-hover:[&>iframe]:opacity-100 
                               [&>iframe]:transition-all [&>iframe]:duration-700 [&>iframe]:ease-out
                               [&>iframe]:scale-100 group-hover:[&>iframe]:scale-[1.02]"
                  />
                  
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-accent/30 rounded-tl-lg pointer-events-none" />
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent/30 rounded-tr-lg pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent/30 rounded-bl-lg pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-accent/30 rounded-br-lg pointer-events-none" />
                </motion.div>
              )}

              {event.mapUrl && event.mapUrl !== 'https://maps.google.com' ? (
                <motion.a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 
                             bg-accent/5 text-accent font-body text-xs tracking-[0.15em] uppercase
                             hover:bg-accent hover:text-primary-foreground 
                             transition-all duration-400 rounded-xl 
                             shadow-[0_2px_15px_rgba(212,175,55,0.15)]
                             hover:shadow-[0_4px_25px_rgba(212,175,55,0.3)]
                             border border-accent/20 hover:border-accent"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MapPin className="w-4 h-4" />
                  Buka di Google Maps
                </motion.a>
              ) : (
                <div className="inline-flex items-center gap-2 px-8 py-3 text-muted-foreground/50 font-body text-xs tracking-[0.15em] uppercase rounded-lg cursor-not-allowed bg-background/30">
                  <MapPin className="w-3.5 h-3.5" />
                  Link Peta Tidak Tersedia
                </div>
              )}
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
