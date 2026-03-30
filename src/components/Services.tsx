import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Truck, Settings, GraduationCap, Headphones, ShieldCheck, Boxes } from "lucide-react";

const services = [
  { icon: Truck, title: "Importation & Distribution", desc: "Reliable supply chain ensuring timely delivery of quality medical products." },
  { icon: Settings, title: "Installation & Setup", desc: "Turnkey hospital installations including theatres, ICUs, and laboratories." },
  { icon: GraduationCap, title: "Training & Education", desc: "Comprehensive product training for healthcare professionals and staff." },
  { icon: Headphones, title: "After-Sales Support", desc: "24/7 technical support and dedicated customer service team." },
  { icon: ShieldCheck, title: "Maintenance & Calibration", desc: "Regular equipment servicing to ensure optimal performance and safety." },
  { icon: Boxes, title: "Biomedical Engineering", desc: "Expert biomedical engineering support for complex medical systems." },
];

const Services = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Services</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-3">
            End-to-End Healthcare Support
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-card rounded-xl p-6 border border-border card-hover cursor-default"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <s.icon size={24} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
