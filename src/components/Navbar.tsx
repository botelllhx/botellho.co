import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Estúdio", href: "/studio" },
    { name: "Serviços", href: "/#servicos" },
    { name: "Trabalhos", href: "/#portfolio" },
    { name: "Contato", href: "/#contato" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm" : "bg-transparent"
          }`}
      >
        <div className="container flex items-center justify-between px-6 py-6">
          {/* Logo */}
          <a href="/" className="group flex items-baseline gap-1" ref={(el) => {
            if (!el) return;
            // Simple logic to add chars if empty, to avoid re-adding
            if (el.querySelector('.logo-char')) return;

            const text = "botellho";
            el.innerHTML = '';

            // Re-construct with spans
            text.split('').forEach((char, index) => {
              const span = document.createElement('span');
              span.textContent = char;
              span.className = 'logo-char text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-2xl font-display';
              span.style.setProperty('--char-index', index.toString());
              el.appendChild(span);
            });

            const dot = document.createElement('span');
            dot.textContent = '.co';
            dot.className = 'text-primary text-xl font-bold tracking-tight md:text-2xl font-display italic';
            el.appendChild(dot);
          }}>
            <span className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
              botellho<span className="text-primary">.</span>co
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-12 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="group relative font-mono text-sm uppercase tracking-widest text-foreground transition-colors hover:text-primary"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <a href="/#contato" className="hidden neo-button py-3 text-xs md:inline-flex">
            Começar um projeto
          </a>

          {/* Mobile Menu Button */}
          <button
            className="relative z-50 flex h-12 w-12 items-center justify-center md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="font-display text-4xl font-bold text-foreground transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="/#contato"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.1 }}
                className="neo-button mt-8"
                onClick={() => setIsMenuOpen(false)}
              >
                Começar um projeto
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
