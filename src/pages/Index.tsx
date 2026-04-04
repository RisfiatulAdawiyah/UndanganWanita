import { motion } from "framer-motion";
import { Heart, Calendar, Gift, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center section-spacing relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-16 h-16 text-accent mx-auto mb-6 fill-accent" />
            <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6">
              Digital Wedding Invitation
            </h1>
            <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
              Create beautiful, personalized wedding invitations for your special day
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/undangan/demo"
                className="px-8 py-4 bg-accent text-primary-foreground font-body text-sm tracking-[0.2em] uppercase
                           hover:bg-accent/90 transition-all duration-300 rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
              >
                View Demo
              </Link>
              <a
                href="#features"
                className="px-8 py-4 border border-accent text-accent font-body text-sm tracking-[0.2em] uppercase
                           hover:bg-accent/10 transition-all duration-300 rounded-xl"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing bg-primary/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="decorative-line mb-6" />
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              Features
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto">
              Everything you need for your perfect wedding invitation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                title: "Event Details",
                description: "Akad & Resepsi with maps integration"
              },
              {
                icon: Users,
                title: "RSVP Management",
                description: "Track guest responses easily"
              },
              {
                icon: Gift,
                title: "Gift Registry",
                description: "Bank accounts & gift wishlist"
              },
              {
                icon: Heart,
                title: "Love Story",
                description: "Share your journey together"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="glass-card rounded-2xl p-6 text-center border-accent/10 hover:border-accent/25 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{feature.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="font-body text-sm text-muted-foreground">
            © 2025 Digital Wedding Invitation. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
