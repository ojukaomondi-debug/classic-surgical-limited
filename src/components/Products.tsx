import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Monitor, Wrench, Scissors, Microscope, Building2 } from "lucide-react";
import devicesImg from "@/assets/devices.jpg";
import equipmentImg from "@/assets/equipment.jpg";
import consumablesImg from "@/assets/consumables.jpg";
import diagnosticsImg from "@/assets/diagnostics.jpg";
import solutionsImg from "@/assets/solutions.jpg";

const categories = [
  {
    icon: Monitor,
    title: "Medical Devices",
    items: ["Patient monitors", "Infusion pumps", "Syringe pumps", "Defibrillators", "ECG machines", "Suction machines", "Nebulizers"],
    image: devicesImg,
  },
  {
    icon: Wrench,
    title: "Medical Equipment",
    items: ["Operating theatre lights", "Autoclaves", "Anesthesia machines", "Hospital beds", "ICU equipment", "Radiology equipment"],
    image: equipmentImg,
  },
  {
    icon: Scissors,
    title: "Surgical Consumables",
    items: ["Surgical gloves", "Sutures", "Surgical drapes", "Syringes & needles", "IV cannulas", "Catheters", "Wound care products"],
    image: consumablesImg,
  },
  {
    icon: Microscope,
    title: "Diagnostics",
    items: ["Hematology analyzers", "Biochemistry analyzers", "Rapid test kits", "Laboratory reagents", "Microscope systems", "Blood collection systems"],
    image: diagnosticsImg,
  },
  {
    icon: Building2,
    title: "Hospital Solutions",
    items: ["Turnkey theatre installation", "ICU setup", "Maternity & neonatal unit setup", "Laboratory installation", "Equipment maintenance & calibration", "Biomedical engineering support"],
    image: solutionsImg,
  },
];

const Products = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="products" className="py-24 bg-secondary/40" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Products</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From medical devices to complete hospital installations, we provide everything your healthcare facility needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden border border-border card-hover"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-primary-foreground">
                  <cat.icon size={22} />
                  <h3 className="font-display text-lg font-bold">{cat.title}</h3>
                </div>
              </div>
              <div className="p-5">
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
