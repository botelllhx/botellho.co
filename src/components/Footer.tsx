import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="site-footer" className="bg-background py-16">
      <div className="container px-6">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo */}
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl font-bold tracking-tight text-foreground"
          >
            botellho<span className="text-primary">.</span>co
          </motion.a>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8"
          >
            {["Serviços", "Portfolio", "Sobre", "Contato"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </motion.div>

          {/* Back to Top */}
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            Voltar ao topo
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Divider */}
        <div className="my-12 h-[1px] w-full bg-foreground/10" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-mono text-xs text-muted-foreground">
            © 2024 botellho.co — Todos os direitos reservados
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Feito com dedicação em{" "}
            <span className="text-primary">Belo Horizonte</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
