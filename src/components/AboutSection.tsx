import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { value: "150+", label: "Projetos Entregues" },
  { value: "8+", label: "Anos de Experiência" },
  { value: "98%", label: "Clientes Satisfeitos" },
  { value: "24/7", label: "Suporte Dedicado" },
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
          (Sobre nós)
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
              Somos uma agência{" "}
              <span className="text-primary">mineira</span> focada em criar
              experiências digitais que{" "}
              <span className="text-stroke-primary">transformam</span>.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                De Belo Horizonte para o mundo. Assim como as montanhas que nos
                cercam, construímos projetos sólidos e duradouros. Nossa paixão
                por projetos criativos e diferentes de desenvolvimento web se traduz em soluções que
                realmente funcionam.
              </p>
              <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                Cada projeto é tratado como único, com dedicação e atenção aos
                detalhes que fazem a diferença. Porque acreditamos que o digital
                pode ser tão acolhedor quanto um pão de queijo quentinho.
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
                Vamos Conversar
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
                  Inovação • Criatividade • Tecnologia • Resultados •{" "}
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
