import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, ExternalLink, Copy, Globe, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserWeddings, useUpdateWedding, useCheckSlug } from "@/hooks/useWedding";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const { data: weddings = [] } = useUserWeddings(user?.id || "");
  const wedding = weddings[0];
  const updateWedding = useUpdateWedding();
  const checkSlug = useCheckSlug();

  const [form, setForm] = useState({
    slug: "",
    is_published: false,
    show_gift_registry: true,
    show_guest_list: false,
  });

  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  useEffect(() => {
    if (wedding) {
      setForm({
        slug: wedding.slug,
        is_published: wedding.is_published,
        show_gift_registry: wedding.show_gift_registry,
        show_guest_list: wedding.show_guest_list,
      });
    }
  }, [wedding]);

  const handleCheckSlug = async (newSlug: string) => {
    if (!newSlug || newSlug === wedding?.slug) {
      setSlugAvailable(null);
      return;
    }

    setCheckingSlug(true);
    try {
      const available = await checkSlug.mutateAsync(newSlug);
      setSlugAvailable(available);
    } catch (error) {
      setSlugAvailable(false);
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding) return;

    if (form.slug !== wedding.slug && slugAvailable === false) {
      toast.error("This slug is already taken");
      return;
    }

    try {
      await updateWedding.mutateAsync({
        id: wedding.id,
        updates: form,
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const invitationUrl = wedding ? `${window.location.origin}/undangan/${form.slug}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(invitationUrl);
    toast.success("Link copied to clipboard!");
  };

  if (!wedding) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="font-body text-muted-foreground">No wedding found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl text-foreground mb-2">Settings</h1>
        <p className="font-body text-muted-foreground">
          Manage your wedding invitation settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Publication Status */}
        <motion.div
          className="glass-card rounded-xl p-6 border-accent/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-display text-xl text-foreground mb-4">Publication Status</h2>
          
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
            <div className="flex items-center gap-3">
              {form.is_published ? (
                <Eye className="w-5 h-5 text-green-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <p className="font-body text-sm text-foreground font-medium">
                  {form.is_published ? "Published" : "Draft"}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {form.is_published
                    ? "Your invitation is live and accessible to guests"
                    : "Your invitation is hidden from public view"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_published: !form.is_published })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.is_published ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.is_published ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Invitation URL */}
        <motion.div
          className="glass-card rounded-xl p-6 border-accent/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-display text-xl text-foreground mb-4">Invitation URL</h2>
          
          <div className="space-y-4">
            <div>
              <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2.5">
                URL Slug
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => {
                      const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setForm({ ...form, slug: newSlug });
                      handleCheckSlug(newSlug);
                    }}
                    className="w-full bg-background/50 border border-border/60 rounded-xl pl-12 pr-5 py-3 font-body text-sm text-foreground
                               focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                    placeholder="your-wedding-slug"
                  />
                </div>
              </div>
              {checkingSlug && (
                <p className="font-body text-xs text-muted-foreground mt-2">Checking availability...</p>
              )}
              {slugAvailable === true && form.slug !== wedding.slug && (
                <p className="font-body text-xs text-green-500 mt-2">✓ This slug is available</p>
              )}
              {slugAvailable === false && (
                <p className="font-body text-xs text-destructive mt-2">✗ This slug is already taken</p>
              )}
            </div>

            <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl">
              <p className="font-body text-xs text-muted-foreground mb-2">Full URL:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-sm text-foreground bg-background/50 px-3 py-2 rounded-lg overflow-x-auto">
                  {invitationUrl}
                </code>
                <button
                  type="button"
                  onClick={copyLink}
                  className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={invitationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Display Options */}
        <motion.div
          className="glass-card rounded-xl p-6 border-accent/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-xl text-foreground mb-4">Display Options</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
              <div>
                <p className="font-body text-sm text-foreground font-medium">Show Gift Registry</p>
                <p className="font-body text-xs text-muted-foreground">
                  Display gift registry section on invitation
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, show_gift_registry: !form.show_gift_registry })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.show_gift_registry ? "bg-accent" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.show_gift_registry ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
              <div>
                <p className="font-body text-sm text-foreground font-medium">Show Guest List</p>
                <p className="font-body text-xs text-muted-foreground">
                  Display guest list section on invitation
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, show_guest_list: !form.show_guest_list })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.show_guest_list ? "bg-accent" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.show_guest_list ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          type="submit"
          disabled={updateWedding.isPending || (slugAvailable === false && form.slug !== wedding.slug)}
          className="w-full py-4 bg-accent text-primary-foreground font-body text-sm tracking-[0.2em] uppercase
                     hover:bg-accent/90 transition-all duration-300 rounded-xl flex items-center justify-center gap-3
                     shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.35)]
                     disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: updateWedding.isPending ? 1 : 1.02 }}
          whileTap={{ scale: updateWedding.isPending ? 1 : 0.98 }}
        >
          {updateWedding.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default Settings;
