import { Head } from "vite-react-ssg";
import { Link, useLoaderData } from "react-router-dom";
import LineReveal from "@/motion/LineReveal";
import Typing from "@/motion/Typing";
import type { WorkCaseLoaderData } from "@/pages/workLoaders";

// O case como heroi: abertura cinematografica, imagem full-bleed e a
// anatomia do trabalho em leitura longa.
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
          <Link to="/trabalhos" className="cmd-button mt-10">
            Voltar ao arquivo
          </Link>
        </section>
      </>
    );
  }

  const ogImage =
    project.media_type === "image" && project.cover_media_url
      ? project.cover_media_url
      : "https://botellho.com/og-image.jpg";
  const externalLink = project.project_url || project.repo_url || null;
  const paragraphs = (project.full_description ?? project.short_description)
    .split("\n")
    .filter(Boolean);

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

      <article>
        <section className="px-4 pt-16 md:px-6 md:pt-24">
          <Typing
            text={`> abrindo /trabalhos/${project.slug}`}
            className="type-label text-muted-foreground"
          />
          <LineReveal as="h1" className="type-tese mt-8 max-w-5xl">
            {project.title}
          </LineReveal>

          <div className="mt-10 grid gap-6 border-y border-foreground/10 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground md:grid-cols-3">
            <span>categoria · {project.category || "projeto"}</span>
            <span>status · publicado</span>
            {project.tags.length > 0 ? <span>craft · {project.tags.join(", ")}</span> : <span />}
          </div>
        </section>

        {project.cover_media_url ? (
          <section className="mt-14 px-0 md:px-6">
            <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
              {project.media_type === "video" ? (
                <video
                  src={project.cover_media_url}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={project.cover_media_url}
                  alt={`Capa do projeto ${project.title}`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </section>
        ) : null}

        <section className="px-4 py-20 md:px-6 md:py-28">
          <div className="grid gap-12 md:grid-cols-[16rem_1fr] md:gap-20">
            <div className="space-y-8">
              <div>
                <span className="type-label text-muted-foreground">&gt; resumo</span>
                <p className="mt-3 font-serif text-lg leading-relaxed text-foreground">
                  {project.short_description}
                </p>
              </div>
              {externalLink ? (
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cmd-button-ghost"
                >
                  Visitar projeto
                </a>
              ) : null}
            </div>

            <div className="max-w-2xl space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="font-sans text-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-foreground/10 px-4 py-10 md:px-6">
          <Link
            to="/trabalhos"
            className="font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-phosphor"
          >
            &lt; voltar ao arquivo
          </Link>
        </section>
      </article>
    </>
  );
};

export default WorkCase;
