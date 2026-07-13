import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowUpRight } from "lucide-react";
import { usePortfolioProjects } from "@/hooks/usePortfolioProjects";
import type { PortfolioProject } from "@/types/portfolio";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop"
];

const PortfolioSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const { projects, loading, error, isConfigured } = usePortfolioProjects();

  const x = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const displayProjects = projects.map((project, index) => ({
    id: project.id,
    title: project.title,
    category: project.category || "Projeto",
    description: project.short_description,
    mediaUrl: project.cover_media_url || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
    mediaType: project.media_type,
    tags: project.tags ?? [],
    link: project.project_url || project.repo_url || "#",
  }));

  return (
    <section
      ref={containerRef}
      id="portfolio"
      className="relative overflow-hidden bg-primary py-32 md:py-48"
    >
      {/* Section Label */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container px-6 mb-16"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-primary-foreground/60">
          (Trabalhos selecionados)
        </span>
      </motion.div>

      {/* Large Moving Text */}
      <motion.div style={{ x }} className="mb-24 overflow-hidden">
        <h2 className="text-huge font-display font-bold text-primary-foreground whitespace-nowrap">
          TRABALHOS · TRABALHOS · TRABALHOS ·
        </h2>
      </motion.div>

      {/* Projects */}
      <div className="container px-6">
        <div className="space-y-24">
          {loading ? (
            <div className="text-center text-primary-foreground">Carregando projetos...</div>
          ) : error ? (
            <div className="text-center text-red-400">Erro ao carregar projetos.</div>
          ) : !isConfigured ? (
            <div className="text-center text-primary-foreground/70">
              Portfolio em configuracao. Defina o Supabase para exibir os projetos curados.
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="text-center text-primary-foreground/70">
              Nenhum projeto publicado no studio ainda.
            </div>
          ) : (
            displayProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))
          )}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 text-center"
        >
          <span className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-primary-foreground/70">
            Seleção curada de trabalhos do estúdio
          </span>
        </motion.div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    category: string;
    description: string;
    mediaUrl: string;
    mediaType: PortfolioProject["media_type"];
    tags: string[];
    link?: string;
  };
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 });
  const [isHovered, setIsHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`creative-card flex flex-col gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary md:w-[58%] md:flex-none xl:w-[64%] xl:aspect-[21/9]">
        {project.mediaType === "video" ? (
          <motion.video
            src={project.mediaUrl}
            className="h-full w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            animate={{ scale: isHovered ? 1.03 : 1 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <motion.img
            src={project.mediaUrl}
            alt={project.title}
            className="h-full w-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6 }}
          />
        )}
        <motion.div
          className="absolute inset-0 bg-primary"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: isInView ? 0 : 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ originX: isEven ? 1 : 0 }}
        />
      </div>

      {/* Info */}
      <div className="flex w-full flex-col justify-center md:w-[42%] md:flex-none md:px-4 lg:px-6 xl:w-[36%]">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-primary-foreground/60">
            {project.category}
          </span>
        </div>

        <h3 className="text-large font-display font-bold text-primary-foreground mb-4">
          {project.title}
        </h3>

        <p className="font-sans text-base leading-relaxed text-primary-foreground/70 mb-8">
          {project.description}
        </p>

        {project.tags.length > 0 ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-widest text-primary-foreground/80 border border-primary-foreground/20 px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <motion.a
          href={project.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-primary-foreground"
          whileHover={{ x: 10 }}
        >
          Ver projeto
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default PortfolioSection;
