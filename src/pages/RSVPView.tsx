import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Users, CheckCircle, XCircle, Calendar, Download, Search, Eye, EyeOff } from "lucide-react";
import { useRSVPResponses, useRSVPStats, exportRSVPToCSV } from "@/hooks/useRSVP";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const RSVPView = () => {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const WEDDING_ID = "b2d6e798-ebc4-478d-a69c-7a9655749bdc"; // indah-indra
  const CORRECT_PIN = import.meta.env.VITE_RSVP_PIN || "1234";

  const { data: rsvps = [], isLoading } = useRSVPResponses(WEDDING_ID);
  const { data: stats } = useRSVPStats(WEDDING_ID);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("rsvp_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("rsvp_auth", "true");
      toast.success("Akses berhasil!");
    } else {
      toast.error("PIN salah!");
      setPin("");
    }
  };

  const handleExport = () => {
    exportRSVPToCSV(filteredRsvps, `rsvp-indah-indra-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success("Data berhasil diexport!");
  };

  const filteredRsvps = rsvps.filter(rsvp =>
    rsvp.guest_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-accent/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="font-display text-2xl">RSVP View</CardTitle>
              <CardDescription>Masukkan PIN untuk melihat daftar RSVP</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Masukkan PIN 4 digit"
                    maxLength={4}
                    className="text-center text-2xl tracking-widest pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                  Masuk
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl text-foreground mb-2">Daftar RSVP</h1>
          <p className="font-body text-muted-foreground">Undangan Pernikahan Indah & Indra</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total RSVP", value: stats?.total || 0, color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: CheckCircle, label: "Hadir", value: stats?.attending || 0, color: "text-green-500", bg: "bg-green-500/10" },
            { icon: XCircle, label: "Tidak Hadir", value: stats?.notAttending || 0, color: "text-red-500", bg: "bg-red-500/10" },
            { icon: Calendar, label: "Total Tamu", value: stats?.totalGuests || 0, color: "text-accent", bg: "bg-accent/10" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-accent/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="font-body text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="font-display text-3xl text-foreground">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari nama tamu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </motion.div>

        {/* RSVP List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-accent/10">
            <CardHeader>
              <CardTitle>Daftar Tamu ({filteredRsvps.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Memuat data...</p>
                </div>
              ) : filteredRsvps.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada RSVP"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRsvps.map((rsvp, index) => (
                    <motion.div
                      key={rsvp.id}
                      className="p-4 border border-border/50 rounded-xl hover:border-accent/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-display text-lg text-foreground">{rsvp.guest_name}</h3>
                            <Badge variant={rsvp.attendance === "yes" ? "default" : "secondary"}>
                              {rsvp.attendance === "yes" ? "Hadir" : "Tidak Hadir"}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Jumlah Tamu: {rsvp.number_of_guests} orang</p>
                            {rsvp.message && <p className="italic">"{rsvp.message}"</p>}
                            {rsvp.phone && <p>Telepon: {rsvp.phone}</p>}
                            {rsvp.email && <p>Email: {rsvp.email}</p>}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(rsvp.submitted_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RSVPView;
