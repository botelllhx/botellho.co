import { Head } from "vite-react-ssg";
import { Link, useLoaderData } from "react-router-dom";
import Scramble from "@/motion/Scramble";
import Typing from "@/motion/Typing";
import type { WorkCaseLoaderData } from "@/pages/workLoaders";

// Case como heroi (A -> C -> B -> D), com alternancia de cor e a imagem
// tratada na lingua da maquina.
const WorkCase = () => {
  const { project } = useLoaderData() as WorkCaseLoaderData;

  if (!project) {
    return (
      <>
        <Head>
          <title>Case não encontrado | botellho</title>
          <meta name="robots" content="noindex" />
        </Head>
        <section className="px-4 py-24 md:px-6">
          <p className="type-dos text-phosphor">&gt; erro · bloco não encontrado</p>
          <h1 className="type-title mt-6">Esse case não está publicado.</h1>
          <Link to="/trabalhos" className="cmd-button mt-10">Voltar ao arquivo</Link>
        </section>
      </>
    );
  }

  const ogImage =
    project.media_type === "image" && project.cover_media_url ? project.cover_media_url : "https://botellho.com/og-image.jpg";
  const externalLink = project.project_url || project.repo_url || null;
  const paragraphs = (project.full_description ?? project.short_description).split("\n").filter(Boolean);

  return (
    <>
      <Head>
        <title>{`${project.title} | botellho`}</title>
        <meta name="description" content={project.short_description} />
        <link rel="canonical" href={`https://botellho.com/trabalhos/${project.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${project.title} | botellho`} />
        <meta property="og:description" content={project.short_description} />
        <meta property="og:url" content={`https://botellho.com/trabalhos/${project.slug}`} />
        <meta property="og:image" content={ogImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            about: project.category,
            description: project.short_description,
            url: `https://botellho.com/trabalhos/${project.slug}`,
            image: ogImage,
            creator: { "@type": "Organization", name: "botellho", url: "https://botellho.com" },
          })}
        </script>
      </Head>

      {/* ===== A · Abertura cinematografica (azul) ===== */}
      <section className="bg-phosphor px-4 pb-16 pt-16 text-paper md:px-6 md:pb-24 md:pt-24">
        <Typing text={`> abrindo /trabalhos/${project.slug}`} className="type-label text-paper/60" />
        <Scramble as="h1" text={project.title} className="mt-8 block font-display leading-[0.9] tracking-[-0.03em] text-[clamp(2.5rem,8.5vw,9rem)]" />
        <div className="mt-10 grid gap-4 border-y border-paper/25 py-4 font-mono text-xs uppercase tracking-widest text-paper/70 md:grid-cols-3">
          <span>categoria · {project.category || "projeto"}</span>
          <span>status · publicado</span>
          {project.tags.length > 0 ? <span>craft · {project.tags.join(", ")}</span> : <span />}
        </div>
        {project.cover_media_url ? (
          <div className="mt-10 crt-frame aspect-[16/9] w-full" data-cursor="3d">
            {project.media_type === "video" ? (
              <video src={project.cover_media_url} className="h-full w-full object-cover" autoPlay muted loop playsInline />
            ) : (
              <img
                src={project.cover_media_url}
                alt={`Capa do projeto ${project.title}`}
                className="h-full w-full object-cover grayscale contrast-[1.3] brightness-90"
              />
            )}
            <div className="crt-frame__glass" />
          </div>
        ) : null}
      </section>

      {/* ===== C · Contexto (branco, lead grande) ===== */}
      <section className="bg-background px-4 py-20 md:px-6 md:py-28">
        <span className="type-label text-muted-foreground">contexto</span>
        <p className="mt-6 max-w-4xl font-sans text-2xl font-medium leading-snug text-foreground md:text-4xl">
          {project.short_description}
        </p>
      </section>

      {/* ===== B · Abordagem (azul, leitura longa) ===== */}
      <section className="bg-phosphor px-4 py-20 text-paper md:px-6 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <span className="type-label text-paper/60">abordagem</span>
            {project.tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="border border-paper/30 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-paper/80">{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="max-w-2xl space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="font-sans text-lg leading-relaxed text-paper/85">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ===== D · Fecho (branco) ===== */}
      <section className="px-4 py-16 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link to="/trabalhos" className="font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-phosphor">
            &lt; voltar ao arquivo
          </Link>
          <div className="flex flex-wrap gap-3">
            {externalLink ? (
              <a href={externalLink} target="_blank" rel="noopener noreferrer" className="cmd-button-ghost">Visitar projeto</a>
            ) : null}
            <Link to="/contato" className="cmd-button">Começar um projeto</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default WorkCase;
