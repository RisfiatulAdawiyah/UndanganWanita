import { useState, lazy, Suspense } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWeddingBySlug } from "@/hooks/useWedding";
import CoverScreen from "@/components/wedding/CoverScreen";
import HeroSection from "@/components/wedding/HeroSection";
import CountdownTimer from "@/components/wedding/CountdownTimer";
import MusicControl from "@/components/wedding/MusicControl";
import FloatingNav from "@/components/wedding/FloatingNav";
import ActionButtons from "@/components/wedding/ActionButtons";

// Lazy load components yang tidak immediately visible
const QuranVerse = lazy(() => import("@/components/wedding/QuranVerse"));
const LoveStoryTimeline = lazy(() => import("@/components/wedding/LoveStoryTimeline"));
const PhotoGallery = lazy(() => import("@/components/wedding/PhotoGallery"));
const EventDetails = lazy(() => import("@/components/wedding/EventDetails"));
const GiftRegistrySection = lazy(() => import("@/components/wedding/GiftRegistrySection"));
const QuoteSection = lazy(() => import("@/components/wedding/QuoteSection"));
const RSVPForm = lazy(() => import("@/components/wedding/RSVPForm"));
const ClosingSection = lazy(() => import("@/components/wedding/ClosingSection"));

// Loading component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

const Wedding = () => {
  const { slug } = useParams<{ slug: string }>();
  const [showCover, setShowCover] = useState(true);
  
  const { data: wedding, isLoading, error } = useWeddingBySlug(slug || '');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-muted-foreground">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  // Error or not found
  if (error || !wedding) {
    return <Navigate to="/404" replace />;
  }

  // Not published
  if (!wedding.is_published) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl text-foreground mb-4">Segera Hadir</h1>
          <p className="font-body text-sm text-muted-foreground">
            Undangan ini belum dipublikasikan. Silakan cek kembali nanti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CoverScreen 
        isVisible={showCover} 
        onOpen={() => setShowCover(false)}
        wedding={wedding}
      />

      {!showCover && (
        <>
          <motion.main
            className="min-h-screen bg-background overflow-x-hidden hw-accelerate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div id="hero">
              <HeroSection wedding={wedding} />
              <div className="flex justify-center py-8">
                <ActionButtons 
                  weddingDate={wedding.wedding_date}
                  groomName={wedding.groom_name}
                  brideName={wedding.bride_name}
                />
              </div>
            </div>
            <CountdownTimer weddingDate={wedding.wedding_date} />
            
            <Suspense fallback={<SectionLoader />}>
              <QuranVerse wedding={wedding} />
            </Suspense>
            
            <div id="story">
              <Suspense fallback={<SectionLoader />}>
                <LoveStoryTimeline weddingId={wedding.id} />
              </Suspense>
            </div>
            
            <Suspense fallback={<SectionLoader />}>
              <PhotoGallery weddingId={wedding.id} />
            </Suspense>
            
            <div id="event">
              <Suspense fallback={<SectionLoader />}>
                <EventDetails wedding={wedding} />
              </Suspense>
            </div>
            
            <div id="gift">
              {wedding.show_gift_registry && (
                <Suspense fallback={<SectionLoader />}>
                  <GiftRegistrySection weddingId={wedding.id} />
                </Suspense>
              )}
            </div>
            
            <Suspense fallback={<SectionLoader />}>
              <QuoteSection wedding={wedding} />
            </Suspense>
            
            <div id="rsvp">
              <Suspense fallback={<SectionLoader />}>
                <RSVPForm weddingId={wedding.id} />
              </Suspense>
            </div>
            
            <Suspense fallback={<SectionLoader />}>
              <ClosingSection wedding={wedding} />
            </Suspense>
          </motion.main>
          
          {/* Fixed UI Components - Outside main for proper z-index */}
          <MusicControl musicUrl={wedding.music_url} />
          <FloatingNav />
        </>
      )}
    </>
  );
};

export default Wedding;
