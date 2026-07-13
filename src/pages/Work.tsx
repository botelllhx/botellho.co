import { Head } from "vite-react-ssg";
import { Link, useLoaderData } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { WorksLoaderData } from "@/pages/workLoaders";

const Work = () => {
  const { projects, configured } = useLoaderData() as WorksLoaderData;

  return (
    <>
      <Head>
        <title>Trabalhos | botellho</title>
        <meta
          name="description"
          content="Seleção de trabalhos do botellho: sites institucionais, experiências 3D, acervo e patrimônio digital para instituições culturais e marcas."
        />
        <link rel="canonical" href="https://botellho.com/work" />
        <meta property="og:title" content="Trabalhos | botellho" />
        <meta
          property="og:description"
          content="Seleção de trabalhos do botellho: do institucional ao imersivo, com a mesma régua de craft."
        />
        <meta property="og:url" content="https://botellho.com/work" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      <div className="relative min-h-screen bg-background text-foreground">
        <Navbar />

        <main>
          <section className="container px-6 pt-40 pb-20 md:pt-48 md:pb-24">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              (Trabalhos)
            </span>
            <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,5.5vw,5rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              Do institucional ao imersivo, a mesma régua de{" "}
              <span className="text-primary">craft</span>.
            </h1>
          </section>

          <section className="border-t border-foreground/10">
            {projects.length === 0 ? (
              <div className="container px-6 py-24 md:py-32">
                <p className="max-w-xl font-sans text-lg leading-relaxed text-muted-foreground">
                  {configured
                    ? "Os primeiros cases estão a caminho. Enquanto isso, veja como o estúdio trabalha."
                    : "Portfólio em configuração. Os cases aparecem aqui assim que forem publicados."}
                </p>
                <a href="/studio" className="neo-button mt-8 inline-flex">
                  Conhecer o estúdio
                </a>
              </div>
            ) : (
              <ul className="container px-6">
                {projects.map((project) => (
                  <li key={project.id} className="border-b border-foreground/10">
                    <Link
                      to={`/work/${project.slug}`}
                      className="group flex flex-col gap-4 py-10 md:flex-row md:items-baseline md:gap-12 md:py-14"
                    >
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:w-48 md:flex-none">
                        {project.category || "Projeto"}
                      </span>
                      <div className="flex-1">
                        <h2 className="font-display text-3xl font-bold text-foreground transition-colors group-hover:text-primary md:text-5xl">
                          {project.title}
                        </h2>
                        <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
                          {project.short_description}
                        </p>
                      </div>
                      <span className="font-display text-3xl text-foreground transition-transform group-hover:translate-x-2 md:self-center">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Work;
