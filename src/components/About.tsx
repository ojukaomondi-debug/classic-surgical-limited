import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";

const stats = [
  { value: "500+", label: "Healthcare Facilities" },
  { value: "1000+", label: "Products Available" },
  { value: "10+", label: "Years Experience" },
  { value: "24/7", label: "Support Available" },
];

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">About Us</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-6">
              Leading Medical Supply Solutions Since Day One
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Classic Surgicals Limited is a leading medical supply company specializing in importation, distribution, and sales of medical devices, medical equipment, surgical consumables, hospital solutions, and diagnostic products.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We are committed to delivering high-quality, innovative, and cost-effective healthcare solutions to hospitals, clinics, laboratories, government institutions, NGOs, and private healthcare providers.
            </p>
            <ul className="space-y-3">
              {[
                "High-quality medical supply solutions",
                "Trusted by hospitals & clinics",
                "Comprehensive after-sales support",
                "Equipment maintenance & calibration",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="text-primary shrink-0" size={20} />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="bg-card rounded-xl p-6 text-center card-hover border border-border"
              >
                <div className="font-display text-3xl font-bold text-primary mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
