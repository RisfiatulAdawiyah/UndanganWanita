import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { useSubmitRSVP } from "@/hooks/useRSVP";
import { toast } from "sonner";
import Confetti from "./Confetti";

interface RSVPFormProps {
  weddingId: string;
}

const RSVPForm = ({ weddingId }: RSVPFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    attendance: "yes" as "yes" | "no",
    guests: "1",
    message: "",
    phone: "",
    email: "",
  });

  const submitRSVP = useSubmitRSVP();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitRSVP.mutateAsync({
        wedding_id: weddingId,
        guest_name: form.name,
        attendance: form.attendance,
        number_of_guests: parseInt(form.guests),
        message: form.message || null,
        phone: form.phone || null,
        email: form.email || null,
      });
      
      setSubmitted(true);
      toast.success("Thank you for your RSVP!");
    } catch (error) {
      toast.error("Failed to submit RSVP. Please try again.");
      console.error(error);
    }
  };

  const inputClass = `w-full bg-background/50 rounded-xl px-5 py-3.5 font-body text-sm text-foreground
                      focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10
                      smooth-transition placeholder:text-muted-foreground/40 hover:bg-background/60`;

  return (
    <section className="section-spacing relative overflow-hidden bg-batik-pattern bg-batik-ornament" style={{ '--bg-color': '#1a5f4f' } as React.CSSProperties}>
      {/* Batik pattern border */}
      <div className="absolute top-0 left-0 right-0 batik-border-top" />
      
      <div className="max-w-lg mx-auto relative z-10 px-4">
        <motion.div
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="section-subtitle">
            Apakah Anda Akan Hadir?
          </p>
          <h3 className="section-title text-gradient-gold">RSVP</h3>
        </motion.div>

        <div className="glass-container batik-frame batik-corners">
          {submitted ? (
          <>
            <Confetti active={true} />
            <motion.div
              className="glass-card rounded-2xl p-10 md:p-12 text-center
                          shadow-[0_4px_30px_rgba(47,93,80,0.06)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-accent" />
              </div>
              <h4 className="font-display text-2xl text-foreground mb-3">Terima Kasih!</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Respon Anda telah tercatat. Kami menantikan untuk merayakan bersama Anda.
              </p>
            </motion.div>
          </>
        ) : (
          <motion.form
            className="glass-card rounded-2xl p-8 md:p-10 space-y-6 smooth-transition-slow shimmer-effect"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Masukkan nama Anda"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-3">
                Kehadiran
              </label>
              <div className="flex gap-3">
                {["yes", "no"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setForm({ ...form, attendance: val })}
                    className={`flex-1 py-3.5 font-body text-sm tracking-wider uppercase rounded-xl transition-all duration-300 ${
                      form.attendance === val
                        ? "bg-accent text-primary-foreground shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
                        : "text-muted-foreground hover:border-accent/40 bg-background/50"
                    }`}
                  >
                    {val === "yes" ? "Dengan Senang Hati Hadir" : "Mohon Maaf Tidak Bisa Hadir"}
                  </button>
                ))}
              </div>
            </motion.div>

            {form.attendance === "yes" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2.5">
                  Jumlah Tamu
                </label>
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className={inputClass}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} Tamu</option>
                  ))}
                </select>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2.5">
                Ucapan & Pesan
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Tulis ucapan Anda untuk pasangan..."
              />
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div>
                <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2.5">
                  Telepon (Opsional)
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                  placeholder="Nomor telepon Anda"
                />
              </div>
              <div>
                <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2.5">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="Email Anda"
                />
              </div>
            </motion.div>


            <motion.button
              type="submit"
              disabled={submitRSVP.isPending}
              className="w-full py-4 bg-accent text-primary-foreground font-body text-sm tracking-[0.2em] uppercase
                         hover:bg-accent/90 transition-all duration-300 rounded-xl flex items-center justify-center gap-3
                         shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.35)]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: submitRSVP.isPending ? 1 : 1.02 }}
              whileTap={{ scale: submitRSVP.isPending ? 1 : 0.98 }}
            >
              {submitRSVP.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim RSVP
                </>
              )}
            </motion.button>
          </motion.form>
        )}
        </div>
      </div>
    </section>
  );
};

export default RSVPForm;
