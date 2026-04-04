import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check, ExternalLink, CreditCard, Wallet, Package } from "lucide-react";
import { useGiftRegistry } from "@/hooks/useGiftRegistry";
import { GiftRegistry } from "@/types/wedding.types";

interface GiftRegistrySectionProps {
  weddingId: string;
}

const GiftRegistrySection = ({ weddingId }: GiftRegistrySectionProps) => {
  const { data: gifts = [], isLoading } = useGiftRegistry(weddingId);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const banks = gifts.filter(g => g.type === 'bank');
  const ewallets = gifts.filter(g => g.type === 'ewallet');
  const giftItems = gifts.filter(g => g.type === 'gift_item');

  if (isLoading || gifts.length === 0) return null;

  const renderGiftCard = (gift: GiftRegistry) => {
    const isCopied = copiedId === gift.id;

    if (gift.type === 'gift_item') {
      return (
        <motion.div
          key={gift.id}
          className="glass-card rounded-2xl p-6 smooth-transition hover-lift shimmer-effect"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h5 className="font-display text-lg text-foreground mb-1">{gift.item_name}</h5>
              {gift.item_description && (
                <p className="font-body text-sm text-muted-foreground mb-3 leading-relaxed">
                  {gift.item_description}
                </p>
              )}
              {gift.item_link && (
                <a
                  href={gift.item_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-body text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Lihat Barang
                </a>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={gift.id}
        className="glass-card rounded-2xl p-6 hover:border-accent/25 transition-all duration-500
                   shadow-[0_4px_30px_rgba(47,93,80,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              {gift.type === 'bank' ? (
                <CreditCard className="w-6 h-6 text-accent" />
              ) : (
                <Wallet className="w-6 h-6 text-accent" />
              )}
            </div>
            <div>
              <p className="font-body text-xs text-accent tracking-[0.2em] uppercase font-medium">
                {gift.bank_name}
              </p>
              <h5 className="font-display text-lg text-foreground">{gift.account_name}</h5>
            </div>
          </div>
        </div>

        <div className="bg-background/50 rounded-xl p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="font-body text-xs text-muted-foreground mb-1">Nomor Rekening</p>
              <p className="font-mono text-base text-foreground tracking-wider">
                {gift.account_number}
              </p>
            </div>
            <motion.button
              onClick={() => copyToClipboard(gift.account_number || '', gift.id)}
              className="w-10 h-10 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center
                         text-accent transition-colors flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="section-spacing relative overflow-hidden bg-batik-pattern bg-batik-ornament" style={{ '--bg-color': '#1a5f4f' } as React.CSSProperties}>
      {/* Batik pattern border */}
      <div className="absolute top-0 left-0 right-0 batik-border-top" />
      
      <div className="max-w-3xl mx-auto relative z-10 px-4">
        <motion.div
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="section-subtitle">
            Hadiah Pernikahan
          </p>
          <h3 className="section-title text-gradient-gold">
            Daftar Hadiah
          </h3>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mt-4">
            Kehadiran Anda adalah hadiah terbesar, namun jika Anda ingin memberi hadiah, kami akan sangat berterima kasih.
          </p>
        </motion.div>

        <div className="glass-container batik-frame batik-corners">
          <div className="space-y-8">
          {banks.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-accent" />
                <h4 className="font-display text-xl text-foreground">Transfer Bank</h4>
              </div>
              <div className="grid gap-4">
                {banks.map(renderGiftCard)}
              </div>
            </div>
          )}

          {ewallets.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-5 h-5 text-accent" />
                <h4 className="font-display text-xl text-foreground">Dompet Digital</h4>
              </div>
              <div className="grid gap-4">
                {ewallets.map(renderGiftCard)}
              </div>
            </div>
          )}

          {giftItems.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-5 h-5 text-accent" />
                <h4 className="font-display text-xl text-foreground">Barang Hadiah</h4>
              </div>
              <div className="grid gap-4">
                {giftItems.map(renderGiftCard)}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftRegistrySection;
