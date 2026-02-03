import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Main Content */}
      <motion.div
        style={{ opacity, scale }}
        className="container relative z-10 flex min-h-screen flex-col justify-center px-6 py-20"
      >
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute left-6 top-32 md:top-40"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Agência Digital
          </span>
        </motion.div>

        {/* Main Typography - Asymmetric Layout */}
        <div className="mt-20 md:mt-0">
          {/* Line 1 */}
          <motion.div
            style={{ y: y1 }}
            className="overflow-hidden"
          >
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-massive font-bold tracking-tighter text-foreground"
            >
              CRIAMOS
            </motion.h1>
          </motion.div>

          {/* Line 2 - Offset */}
          <motion.div
            style={{ y: y2 }}
            className="overflow-hidden md:ml-[15vw]"
          >
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-massive font-bold tracking-tighter text-primary"
            >
              DIGITAL
            </motion.h1>
          </motion.div>

          {/* Line 3 - Different offset */}
          <motion.div
            style={{ y: y3 }}
            className="overflow-hidden md:ml-[5vw]"
          >
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-massive font-bold tracking-tighter text-stroke"
            >
              ÚNICO
            </motion.h1>
          </motion.div>
        </div>

        {/* Description & CTA - Positioned asymmetrically */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-32 right-6 max-w-md md:bottom-40 md:right-12 lg:right-24"
        >
          <p className="font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
            Agência de desenvolvimento de sites e sistemas em{" "}
            <span className="font-semibold text-foreground">Belo Horizonte</span>.
            Especialistas em WordPress e experiências web que{" "}
            <span className="font-semibold text-primary">transformam</span>.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#portfolio" className="neo-button">
              Ver Projetos
            </a>
            <a href="#contato" className="neo-button-outline">
              Contato
            </a>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-12 left-6 flex items-center gap-4"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="h-5 w-5 text-foreground" />
          </motion.div>
        </motion.div>

        {/* Floating asterisk */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.6, type: "spring" }}
          className="absolute right-[10%] top-[30%] hidden md:block"
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="block font-display text-8xl text-primary"
          >
            ✱
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Marquee - Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-primary py-4">
        <div className="marquee-container">
          <div className="marquee-content">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  className="mx-8 font-mono text-sm font-medium uppercase tracking-widest text-primary-foreground"
                >
                  WordPress • Sistemas Web • E-commerce • Landing Pages • UI/UX
                  Design • SEO •{" "}
                </span>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
