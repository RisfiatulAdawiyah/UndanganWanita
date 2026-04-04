import { Calendar, Share2, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

interface ActionButtonsProps {
  weddingDate: string;
  groomName: string;
  brideName: string;
}

const ActionButtons = ({ weddingDate, groomName, brideName }: ActionButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const addToCalendar = () => {
    const date = new Date(weddingDate);
    const title = `Pernikahan ${groomName} & ${brideName}`;
    const details = `Undangan Pernikahan ${groomName} dan ${brideName}`;
    
    // Google Calendar URL
    const startDate = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(date.getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}`;
    
    window.open(googleCalendarUrl, "_blank");
    toast.success("Membuka Google Calendar...");
  };

  const shareInvitation = () => {
    const url = window.location.href;
    const text = `Anda diundang ke pernikahan ${groomName} & ${brideName}! 💍✨`;
    
    if (navigator.share) {
      navigator.share({
        title: `Pernikahan ${groomName} & ${brideName}`,
        text: text,
        url: url,
      }).catch(() => {
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Link undangan disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="flex flex-wrap gap-3 justify-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <motion.button
        className="action-button"
        onClick={addToCalendar}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Calendar className="w-4 h-4" />
        <span>Simpan Tanggal</span>
      </motion.button>

      <motion.button
        className="action-button"
        onClick={shareInvitation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Tersalin!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default ActionButtons;
