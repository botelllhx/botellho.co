import type { PortfolioProject } from "@/types/portfolio";

const PLACEHOLDER = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=60&auto=format",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=60&auto=format",
  "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=1000&q=60&auto=format",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&q=60&auto=format",
];

interface ProjectMediaProps {
  project?: Pick<PortfolioProject, "title" | "cover_media_url" | "media_type"> | null;
  index?: number;
  className?: string;
}

// Escolhe video ou imagem conforme o media_type do projeto. O bug anterior
// renderizava tudo como <img>, entao os cases em video nao apareciam.
const ProjectMedia = ({ project, index = 0, className }: ProjectMediaProps) => {
  const src = project?.cover_media_url || PLACEHOLDER[index % PLACEHOLDER.length];
  const alt = project ? `Prévia de ${project.title}` : "Prévia de conceito";

  if (project?.media_type === "video" && project.cover_media_url) {
    return (
      <video
        src={src}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={className} />;
};

export default ProjectMedia;
