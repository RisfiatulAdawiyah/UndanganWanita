import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Heart,
  Calendar,
  Image,
  Gift,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth, useSignOut } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Heart, label: "Wedding Info", path: "/admin/wedding-info" },
  { icon: Calendar, label: "Love Story", path: "/admin/love-story" },
  { icon: Image, label: "Gallery", path: "/admin/gallery" },
  { icon: Gift, label: "Gift Registry", path: "/admin/gift-registry" },
  { icon: Users, label: "Guest List", path: "/admin/guest-list" },
  { icon: MessageSquare, label: "RSVP", path: "/admin/rsvp" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const signOut = useSignOut();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-accent fill-accent" />
            <span className="font-display text-lg text-foreground">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent hover:bg-accent/20 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <>
            {/* Overlay for mobile */}
            {sidebarOpen && (
              <motion.div
                className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-64 bg-background border-r border-border/50 z-50 lg:z-30 overflow-y-auto"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Logo */}
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-accent fill-accent" />
                  <div>
                    <h1 className="font-display text-xl text-foreground">Wedding Admin</h1>
                    <p className="font-body text-xs text-muted-foreground">Manage your invitation</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  );
                })}
              </nav>

              {/* User Info & Logout */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-background">
                <div className="flex items-center gap-3 mb-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="font-display text-accent text-sm">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-foreground truncate">{user?.email}</p>
                    <p className="font-body text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={signOut.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-body text-sm disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  {signOut.isPending ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
