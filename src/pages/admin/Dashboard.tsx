import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle, Calendar, ExternalLink, Copy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserWeddings } from "@/hooks/useWedding";
import { useRSVPStats } from "@/hooks/useRSVP";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: weddings = [], isLoading } = useUserWeddings(user?.id || "");
  const wedding = weddings[0]; // Get first wedding
  const { data: stats } = useRSVPStats(wedding?.id || "");

  const copyInvitationLink = () => {
    if (wedding) {
      const url = `${window.location.origin}/undangan/${wedding.slug}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="font-display text-3xl text-foreground mb-4">No Wedding Found</h2>
        <p className="font-body text-muted-foreground mb-6">
          You haven't created a wedding invitation yet.
        </p>
        <Link
          to="/admin/wedding-info"
          className="inline-block px-6 py-3 bg-accent text-primary-foreground font-body text-sm tracking-wider uppercase rounded-xl hover:bg-accent/90 transition-colors"
        >
          Create Wedding
        </Link>
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: "Total RSVP",
      value: stats?.total || 0,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: CheckCircle,
      label: "Attending",
      value: stats?.attending || 0,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: XCircle,
      label: "Not Attending",
      value: stats?.notAttending || 0,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      icon: Calendar,
      label: "Total Guests",
      value: stats?.totalGuests || 0,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl text-foreground mb-2">Dashboard</h1>
        <p className="font-body text-muted-foreground">
          Welcome back! Here's an overview of your wedding invitation.
        </p>
      </div>

      {/* Wedding Info Card */}
      <motion.div
        className="glass-card rounded-2xl p-6 border-accent/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-foreground mb-1">
              {wedding.groom_name} & {wedding.bride_name}
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              {new Date(wedding.wedding_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-body ${
                wedding.is_published
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {wedding.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={copyInvitationLink}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-accent/60 text-accent hover:bg-accent/10 transition-colors rounded-xl font-body text-sm"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </button>
            <a
              href={`/undangan/${wedding.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-primary-foreground hover:bg-accent/90 transition-colors rounded-xl font-body text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View Invitation
            </a>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="glass-card rounded-2xl p-6 border-accent/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="font-display text-3xl text-foreground">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        className="glass-card rounded-2xl p-6 border-accent/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-display text-xl text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/admin/wedding-info"
            className="p-4 border border-border/50 rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all text-center"
          >
            <p className="font-body text-sm text-foreground">Edit Wedding Info</p>
          </Link>
          <Link
            to="/admin/gallery"
            className="p-4 border border-border/50 rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all text-center"
          >
            <p className="font-body text-sm text-foreground">Upload Photos</p>
          </Link>
          <Link
            to="/admin/rsvp"
            className="p-4 border border-border/50 rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all text-center"
          >
            <p className="font-body text-sm text-foreground">View RSVPs</p>
          </Link>
          <Link
            to="/admin/settings"
            className="p-4 border border-border/50 rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all text-center"
          >
            <p className="font-body text-sm text-foreground">Settings</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
