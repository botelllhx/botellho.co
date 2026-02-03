import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowUpRight } from "lucide-react";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop"
];

// Import hook (ignoring TS warning for JS file if needed, but allowJs should handle it)
// @ts-ignore
import { useGitHubRepos } from "../hooks/useGitHubRepos";

const PortfolioSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const { repos, loading, error } = useGitHubRepos('botelllhx');

  const x = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Map GitHub repos to project format
  const projects = repos && repos.length > 0
    ? repos.map((repo: any, index: number) => ({
      id: repo.id,
      title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
      category: repo.category || "Web",
      year: new Date(repo.updatedAt).getFullYear().toString(),
      description: repo.description,
      image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
      link: repo.homepage || repo.url
    }))
    : []; // Fallback logic could be added here if needed

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
          PORTFOLIO — PORTFOLIO — PORTFOLIO —
        </h2>
      </motion.div>

      {/* Projects */}
      <div className="container px-6">
        <div className="space-y-24">
          {loading ? (
            <div className="text-center text-primary-foreground">Carregando projetos...</div>
          ) : error ? (
            <div className="text-center text-red-400">Erro ao carregar projetos.</div>
          ) : (
            projects.map((project: any, index: number) => (
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
          <a
            href="https://github.com/botelllhx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-60"
          >
            Ver todos os projetos no GitHub
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    category: string;
    year: string;
    description: string;
    image: string;
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
      className={`flex flex-col gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden md:w-1/2">
        <motion.img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.div
          className="absolute inset-0 bg-primary"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: isInView ? 0 : 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ originX: isEven ? 1 : 0 }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-center md:px-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-primary-foreground/60">
            {project.category}
          </span>
          <span className="font-mono text-xs text-primary-foreground/40">
            {project.year}
          </span>
        </div>

        <h3 className="text-large font-display font-bold text-primary-foreground mb-4">
          {project.title}
        </h3>

        <p className="font-sans text-base leading-relaxed text-primary-foreground/70 mb-8">
          {project.description}
        </p>

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
