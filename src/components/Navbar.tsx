import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { CartDrawer } from "@/components/CartDrawer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Products", href: "/#products" },
  { label: "Services", href: "/#services" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleClick = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const renderLink = (l: typeof links[0]) => {
    if (l.href.startsWith("/") && !l.href.startsWith("/#")) {
      return (
        <Link
          key={l.href}
          to={l.href}
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
        >
          {l.label}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
        </Link>
      );
    }
    return (
      <a
        key={l.href}
        href={l.href}
        onClick={(e) => { if (l.href.startsWith("/#") && location.pathname === "/") { e.preventDefault(); handleClick(l.href); } }}
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
      >
        {l.label}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
      </a>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-24 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Classic Surgicals" className="h-20 w-auto bg-white rounded-md p-1" />
          <span className="font-display text-lg font-bold text-foreground hidden sm:inline">
            Classic Surgicals
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(renderLink)}
          <CartDrawer />
          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5">
              <LogOut size={14} />
              Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-1.5">
                <LogIn size={14} />
                Sign In
              </Button>
            </Link>
          )}
          <a
            href="/#contact"
            onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); handleClick("/#contact"); } }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Phone size={14} />
            Get in Touch
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <CartDrawer />
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              {links.map((l) =>
                l.href.startsWith("/") && !l.href.startsWith("/#") ? (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => { if (l.href.startsWith("/#") && location.pathname === "/") { e.preventDefault(); handleClick(l.href); } }}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                  >
                    {l.label}
                  </a>
                )
              )}
              <div className="border-t border-border pt-3 mt-1">
                {user ? (
                  <button onClick={() => { setOpen(false); handleSignOut(); }} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary py-2">
                    <LogOut size={14} /> Sign Out
                  </button>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium text-primary py-2">
                    <LogIn size={14} /> Sign In / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
