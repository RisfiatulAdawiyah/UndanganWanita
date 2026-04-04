// Helper untuk menggunakan local assets sebagai fallback
import couple1 from "@/assets/couple1.png";
import couple2 from "@/assets/couple2.png";
import couple3 from "@/assets/couple3.png";
import couple4 from "@/assets/couple4.png";
import priasendiri from "@/assets/priasendiri.png";
import wanitasendiri from "@/assets/wanitasendiri.png";
import weddingHero from "@/assets/wedding-hero.jpg";

// Mapping untuk local assets (imported)
const importedAssets: Record<string, string> = {
  '/src/assets/couple1.png': couple1,
  '/src/assets/couple2.png': couple2,
  '/src/assets/couple3.png': couple3,
  '/src/assets/couple4.png': couple4,
  '/src/assets/priasendiri.png': priasendiri,
  '/src/assets/wanitasendiri.png': wanitasendiri,
  '/src/assets/wedding-hero.jpg': weddingHero,
};

// Mapping untuk public folder (direct path)
const publicAssets: Record<string, string> = {
  '/couple1.png': '/couple1.png',
  '/couple2.png': '/couple2.png',
  '/couple3.png': '/couple3.png',
  '/couple4.png': '/couple4.png',
  '/priasendiri.png': '/priasendiri.png',
  '/wanitasendiri.png': '/wanitasendiri.png',
};

export const getImageUrl = (url: string): string => {
  // Jika URL adalah path imported assets
  if (url in importedAssets) {
    return importedAssets[url];
  }
  
  // Jika URL adalah path public folder
  if (url in publicAssets) {
    return publicAssets[url];
  }
  
  // Jika URL adalah Supabase storage atau external URL, return as is
  return url;
};
