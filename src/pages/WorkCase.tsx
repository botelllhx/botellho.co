import { Head } from "vite-react-ssg";
import { Link, useLoaderData } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { WorkCaseLoaderData } from "@/pages/workLoaders";

const WorkCase = () => {
  const { project } = useLoaderData() as WorkCaseLoaderData;

  if (!project) {
    return (
      <>
        <Head>
          <title>Case não encontrado | botellho</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="relative min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="container px-6 pt-40 pb-32">
            <h1 className="font-display text-4xl font-bold">Case não encontrado</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Esse trabalho não está publicado ou o endereço mudou.
            </p>
            <Link to="/work" className="neo-button mt-8 inline-flex">
              Ver todos os trabalhos
            </Link>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const ogImage =
    project.media_type === "image" && project.cover_media_url
      ? project.cover_media_url
      : "https://botellho.com/og-image.jpg";
  const externalLink = project.project_url || project.repo_url || null;

  return (
    <>
      <Head>
        <title>{`${project.title} | botellho`}</title>
        <meta name="description" content={project.short_description} />
        <link rel="canonical" href={`https://botellho.com/work/${project.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${project.title} | botellho`} />
        <meta property="og:description" content={project.short_description} />
        <meta property="og:url" content={`https://botellho.com/work/${project.slug}`} />
        <meta property="og:image" content={ogImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            about: project.category,
            description: project.short_description,
            url: `https://botellho.com/work/${project.slug}`,
            image: ogImage,
            creator: { "@type": "Organization", name: "botellho", url: "https://botellho.com" },
          })}
        </script>
      </Head>

      <div className="relative min-h-screen bg-background text-foreground">
        <Navbar />

        <main>
          <section className="container px-6 pt-40 pb-16 md:pt-48">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {project.category || "Projeto"}
            </span>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.2rem,5.5vw,5rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              {project.title}
            </h1>
            <p className="mt-8 max-w-2xl font-sans text-xl leading-relaxed text-muted-foreground">
              {project.short_description}
            </p>
          </section>

          {project.cover_media_url ? (
            <section className="container px-6">
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

          <section className="border-t border-foreground/10 mt-20 py-20 md:py-28">
            <div className="container grid gap-12 px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
              <div className="space-y-8">
                {project.tags.length > 0 ? (
                  <div>
                    <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Craft
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-foreground/20 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {externalLink ? (
                  <div>
                    <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Link
                    </span>
                    <a
                      href={externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-primary underline underline-offset-4"
                    >
                      Visitar projeto
                    </a>
                  </div>
                ) : null}
              </div>

              <div className="max-w-2xl">
                {project.full_description ? (
                  <div className="space-y-6">
                    {project.full_description.split("\n").filter(Boolean).map((paragraph, index) => (
                      <p
                        key={index}
                        className="font-sans text-lg leading-relaxed text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                    {project.short_description}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="border-t border-foreground/10 py-16">
            <div className="container px-6">
              <Link
                to="/work"
                className="font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                ← Todos os trabalhos
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WorkCase;
