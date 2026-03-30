import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, HeartPulse } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 8 + 10,
  delay: Math.random() * 5,
}));

const Hero = () => (
  <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 hero-overlay" />
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary-foreground/15"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 15, -10, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>

    <div className="container mx-auto px-4 relative z-10 pt-20">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm">
            Your Trusted Medical Supply Partner
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
        >
          Delivering Excellence in{" "}
          <span className="text-accent">Healthcare Solutions</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto leading-relaxed"
        >
          Importation, distribution, and sales of medical devices, equipment, surgical consumables, and diagnostic products for healthcare providers across the region.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <a
            href="#products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground text-foreground font-semibold rounded-lg hover:bg-primary-foreground/90 transition-colors"
          >
            Explore Products <ArrowRight size={18} />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-foreground/40 text-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground/10 transition-colors"
          >
            Contact Us
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-wrap justify-center gap-8"
        >
          {[
            { icon: Shield, label: "Certified Quality" },
            { icon: Award, label: "Trusted Partner" },
            { icon: HeartPulse, label: "Patient-Focused" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-primary-foreground/70">
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
