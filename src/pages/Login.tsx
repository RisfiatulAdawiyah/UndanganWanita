import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Heart } from "lucide-react";
import { useSignIn } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn.mutateAsync({
        email: form.email,
        password: form.password,
      });
      
      toast.success("Welcome back!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-accent mx-auto mb-4 fill-accent" />
          <h1 className="font-display text-3xl text-foreground mb-2">
            Wedding Admin
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Sign in to manage your wedding invitation
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          className="glass-card rounded-2xl p-8 border-accent/10 shadow-[0_4px_30px_rgba(47,93,80,0.06)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-background/50 border border-border/60 rounded-xl pl-12 pr-5 py-3.5 font-body text-sm text-foreground
                             focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10
                             transition-all duration-300 placeholder:text-muted-foreground/40"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-background/50 border border-border/60 rounded-xl pl-12 pr-12 py-3.5 font-body text-sm text-foreground
                             focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10
                             transition-all duration-300 placeholder:text-muted-foreground/40"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={signIn.isPending}
              className="w-full py-4 bg-accent text-primary-foreground font-body text-sm tracking-[0.2em] uppercase
                         hover:bg-accent/90 transition-all duration-300 rounded-xl flex items-center justify-center gap-3
                         shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.35)]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: signIn.isPending ? 1 : 1.02 }}
              whileTap={{ scale: signIn.isPending ? 1 : 0.98 }}
            >
              {signIn.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="font-body text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-body text-xs text-muted-foreground text-center">
            Demo: demo@example.com / demo123456
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
