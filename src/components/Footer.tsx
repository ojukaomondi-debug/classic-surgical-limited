import { HeartPulse } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="grid sm:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary-foreground mb-3">
            <HeartPulse size={22} />
            <span className="font-display text-lg font-bold">Classic Surgicals</span>
          </div>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Delivering high-quality, innovative, and cost-effective healthcare solutions.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold text-primary-foreground mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {["Home", "About", "Products", "Services", "Contact"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold text-primary-foreground mb-3">Products</h4>
          <div className="flex flex-col gap-2">
            {["Medical Devices", "Medical Equipment", "Surgical Consumables", "Diagnostics", "Hospital Solutions"].map((l) => (
              <span key={l} className="text-sm text-primary-foreground/60">{l}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-6 text-center">
        <p className="text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Classic Surgicals Limited. All rights reserved. | classicsurgicalsltd@gmail.com | +254 723 871 493
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
