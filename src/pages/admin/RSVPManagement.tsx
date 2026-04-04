import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Search, Filter, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserWeddings } from "@/hooks/useWedding";
import { useRSVPResponses, useDeleteRSVP, exportRSVPToCSV } from "@/hooks/useRSVP";
import { toast } from "sonner";

const RSVPManagement = () => {
  const { user } = useAuth();
  const { data: weddings = [] } = useUserWeddings(user?.id || "");
  const wedding = weddings[0];
  const { data: rsvps = [], isLoading } = useRSVPResponses(wedding?.id || "");
  const deleteRSVP = useDeleteRSVP();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "yes" | "no">("all");

  const filteredRSVPs = rsvps.filter((rsvp) => {
    const matchesSearch = rsvp.guest_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || rsvp.attendance === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (!wedding) return;
    
    if (confirm("Are you sure you want to delete this RSVP?")) {
      try {
        await deleteRSVP.mutateAsync({ id, weddingId: wedding.id });
        toast.success("RSVP deleted successfully");
      } catch (error) {
        toast.error("Failed to delete RSVP");
      }
    }
  };

  const handleExport = () => {
    if (rsvps.length === 0) {
      toast.error("No RSVP data to export");
      return;
    }
    exportRSVPToCSV(rsvps);
    toast.success("RSVP data exported successfully");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attendance === 'yes').length,
    notAttending: rsvps.filter(r => r.attendance === 'no').length,
    totalGuests: rsvps.filter(r => r.attendance === 'yes').reduce((sum, r) => sum + r.number_of_guests, 0),
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-foreground mb-2">RSVP Management</h1>
          <p className="font-body text-muted-foreground">
            View and manage guest responses
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={rsvps.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary-foreground hover:bg-accent/90 transition-colors rounded-xl font-body text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="glass-card rounded-xl p-6 border-accent/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-body text-sm text-muted-foreground mb-1">Total RSVP</p>
          <p className="font-display text-3xl text-foreground">{stats.total}</p>
        </motion.div>
        <motion.div
          className="glass-card rounded-xl p-6 border-accent/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="font-body text-sm text-muted-foreground mb-1">Attending</p>
          <p className="font-display text-3xl text-green-500">{stats.attending}</p>
        </motion.div>
        <motion.div
          className="glass-card rounded-xl p-6 border-accent/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-body text-sm text-muted-foreground mb-1">Not Attending</p>
          <p className="font-display text-3xl text-red-500">{stats.notAttending}</p>
        </motion.div>
        <motion.div
          className="glass-card rounded-xl p-6 border-accent/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-body text-sm text-muted-foreground mb-1">Total Guests</p>
          <p className="font-display text-3xl text-accent">{stats.totalGuests}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6 border-accent/10">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background/50 border border-border/60 rounded-xl pl-12 pr-5 py-3 font-body text-sm text-foreground
                         focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-background/50 border border-border/60 rounded-xl px-4 py-3 font-body text-sm text-foreground
                         focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
            >
              <option value="all">All Status</option>
              <option value="yes">Attending</option>
              <option value="no">Not Attending</option>
            </select>
          </div>
        </div>
      </div>

      {/* RSVP Table */}
      <div className="glass-card rounded-xl border-accent/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/5 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 text-left font-body text-xs tracking-wider uppercase text-muted-foreground">
                  Guest Name
                </th>
                <th className="px-6 py-4 text-left font-body text-xs tracking-wider uppercase text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-body text-xs tracking-wider uppercase text-muted-foreground">
                  Guests
                </th>
                <th className="px-6 py-4 text-left font-body text-xs tracking-wider uppercase text-muted-foreground">
                  Message
                </th>
                <th className="px-6 py-4 text-left font-body text-xs tracking-wider uppercase text-muted-foreground">
                  Contact
                </th>
                <th className="px-6 py-4 text-left font-body text-xs tracking-wider uppercase text-muted-foreground">
                  Submitted
                </th>
                <th className="px-6 py-4 text-right font-body text-xs tracking-wider uppercase text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredRSVPs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="font-body text-muted-foreground">
                      {searchQuery || filterStatus !== "all" ? "No RSVP found matching your filters" : "No RSVP responses yet"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRSVPs.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4 font-body text-sm text-foreground">
                      {rsvp.guest_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body ${
                        rsvp.attendance === 'yes'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {rsvp.attendance === 'yes' ? (
                          <><CheckCircle className="w-3 h-3" /> Attending</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Not Attending</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-foreground">
                      {rsvp.number_of_guests}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-muted-foreground max-w-xs truncate">
                      {rsvp.message || '-'}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-muted-foreground">
                      {rsvp.phone || rsvp.email || '-'}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-muted-foreground">
                      {new Date(rsvp.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(rsvp.id)}
                        disabled={deleteRSVP.isPending}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RSVPManagement;
