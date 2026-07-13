import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionWireScene from "@/components/SectionWireScene";

const services = [
  {
    number: "01",
    title: "Sites e plataformas institucionais",
    description: "Presença digital para instituições culturais, fundações e organizações, com clareza, acessibilidade e confiança.",
  },
  {
    number: "02",
    title: "Experiências e microsites",
    description: "WebGL, 3D e motion para marcas, lançamentos, festivais e exposições. A experiência é a mensagem.",
  },
  {
    number: "03",
    title: "Acervo e patrimônio digital",
    description: "Coleções, memória e patrimônio apresentados de um jeito que as pessoas querem explorar.",
  },
  {
    number: "04",
    title: "Direção de arte e identidade digital",
    description: "O visual como diferencial, não como enfeite.",
  },
  {
    number: "05",
    title: "Parceria de desenvolvimento (white-label)",
    description: "Construímos o front e as interações que outros estúdios e designers desenham.",
  },
];

const ServicesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={containerRef}
      id="servicos"
      className="relative overflow-hidden bg-background py-32 md:py-48"
    >
      <SectionWireScene
        variant="cup"
        className="absolute -right-10 top-20 hidden h-56 w-72 opacity-90 lg:block"
      />
      {/* Section Label */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container px-6 mb-16"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          (O que fazemos)
        </span>
      </motion.div>

      {/* Large Moving Text */}
      <motion.div style={{ x }} className="mb-24 overflow-hidden">
        <h2 className="text-huge font-display font-bold text-foreground whitespace-nowrap">
          O QUE FAZEMOS · O QUE FAZEMOS · O QUE FAZEMOS ·
        </h2>
      </motion.div>

      {/* Services Grid */}
      <div className="container px-6">
        <div className="grid gap-0 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="container px-6 mt-24"
      >
        <div className="h-[1px] w-full bg-foreground/10 origin-left" />
      </motion.div>
    </section>
  );
};

interface ServiceCardProps {
  service: {
    number: string;
    title: string;
    description: string;
  };
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative border-t border-foreground/10 py-12 md:py-16"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">
        {/* Number */}
        <span className="font-mono text-sm text-muted-foreground">
          {service.number}
        </span>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-large font-display font-bold text-foreground mb-4 transition-colors group-hover:text-primary">
            {service.title}
          </h3>
          <p className="max-w-md font-sans text-base leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ServicesSection;
