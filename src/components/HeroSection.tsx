import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import SignatureCanvas from "@/webgl/SignatureCanvas";
import HeroTunnelScene from "@/webgl/HeroTunnelScene";
import DecodeText from "@/components/DecodeText";

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
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 18,
  });
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 18,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      <motion.div style={{ y: sceneY }} className="absolute inset-0">
        <SignatureCanvas
          className="absolute inset-0 z-[1] pointer-events-none"
          fallback={
            <img
              src="/hero-fallback.png"
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-80"
            />
          }
        >
          <HeroTunnelScene />
        </SignatureCanvas>
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ opacity, scale }}
        className="container relative z-10 flex min-h-screen flex-col justify-center px-6 py-24 md:py-20"
      >
        <div className="absolute left-6 top-24 right-6 flex items-center justify-between md:top-28">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">botellho</span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Estúdio de web e experiências</span>
        </div>

        {/* Main Typography - a tese em um unico h1 */}
        <h1 className="mt-20 font-display text-[clamp(2.3rem,6vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.03em] md:mt-12 xl:mt-0">
          <motion.span style={{ y: y1 }} className="block overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block text-foreground"
            >
              Web que se move.
            </motion.span>
          </motion.span>

          <motion.span style={{ y: y2 }} className="block overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block text-primary"
            >
              <DecodeText text="Experiências digitais" delay={900} duration={800} />
            </motion.span>
          </motion.span>

          <motion.span style={{ y: y3 }} className="block overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="block text-foreground"
            >
              feitas para durar na memória.
            </motion.span>
          </motion.span>
        </h1>

        {/* Description & CTA - Positioned asymmetrically */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
          className="mt-10 max-w-xl self-start border-2 border-foreground/20 bg-background p-5 md:mt-12 md:p-6 xl:absolute xl:bottom-24 xl:right-12 xl:mt-0 xl:max-w-md 2xl:right-24"
        >
          <p className="font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
            Estúdio de web e WebGL com{" "}
            <span className="font-semibold text-foreground">craft de nível de prêmio</span>, para
            marcas, cultura e instituições que tratam o digital como{" "}
            <span className="font-semibold text-primary">experiência</span>, não como folheto.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
            <a href="#contato" className="neo-button px-6 py-3 text-xs">
              Começar um projeto
            </a>
            <a href="#portfolio" className="neo-button-outline px-6 py-3 text-xs">
              Ver trabalhos
            </a>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-12 left-6 hidden items-center gap-4 md:flex"
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

        {/* Floating marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.6, type: "spring" }}
          className="absolute right-[10%] top-[30%] hidden md:block"
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="block border-2 border-primary px-5 py-2 font-display text-6xl text-primary"
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
                  Sites · Experiências 3D · WebGL · Motion · Direção de arte ·
                  Cultura e instituições ·{" "}
                </span>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
