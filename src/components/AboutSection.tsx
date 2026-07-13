import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { value: "Craft", label: "Engenharia e direção de arte" },
  { value: "Cultura", label: "Domínio do setor por dentro" },
  { value: "WebGL", label: "Assinatura técnica" },
  { value: "Acesso", label: "Clareza e acessibilidade" },
];

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section
      ref={containerRef}
      id="sobre"
      className="relative overflow-hidden bg-background py-32 md:py-48"
    >
      {/* Section Label */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container px-6 mb-16"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          (O estúdio)
        </span>
      </motion.div>

      {/* Content Grid */}
      <div className="container px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left - Main Text */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-large font-display font-bold text-foreground mb-8"
            >
              Uma instituição merece um site tão bem construído quanto o{" "}
              <span className="text-primary">acervo</span> que ela{" "}
              <span className="text-stroke-primary">guarda</span>.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                botellho é um estúdio de web e experiências digitais. Juntamos
                três coisas que raramente andam juntas: engenharia de verdade,
                direção de arte, e entendimento de como o setor cultural funciona
                por dentro.
              </p>
              <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                Fazemos do site institucional ao imersivo em 3D, sempre com a
                mesma régua de craft. Trabalhamos com quem trata o digital como
                parte da obra, não como obrigação.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12"
            >
              <a href="#contato" className="neo-button">
                Começar um projeto
              </a>
            </motion.div>

          </div>

          {/* Right - Stats */}
          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Asterisk */}
      <motion.div
        style={{ x, rotate }}
        className="absolute right-[5%] top-1/2 hidden lg:block"
      >
        <span className="font-display text-[12rem] text-primary/10">✱</span>
      </motion.div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-32 overflow-hidden border-y border-foreground/10 py-8"
      >
        <div className="marquee-container">
          <div className="marquee-content-reverse">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  className="mx-12 font-display text-5xl font-bold text-foreground/5 md:text-7xl"
                >
                  Craft • Cultura • WebGL • Patrimônio • Acervo • Experiências •{" "}
                </span>
              ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

interface StatCardProps {
  stat: { value: string; label: string };
  index: number;
}

const StatCard = ({ stat, index }: StatCardProps) => {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <span className="block font-display text-5xl font-bold text-foreground transition-colors group-hover:text-primary md:text-6xl lg:text-7xl">
        {stat.value}
      </span>
      <span className="mt-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {stat.label}
      </span>
    </motion.div>
  );
};

export default AboutSection;
