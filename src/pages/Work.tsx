import { useMemo, useState } from "react";
import { Head } from "vite-react-ssg";
import { Link, useLoaderData } from "react-router-dom";
import LineReveal from "@/motion/LineReveal";
import Typing from "@/motion/Typing";
import ProjectMedia from "@/system/ProjectMedia";
import type { WorksLoaderData } from "@/pages/workLoaders";

const toHex = (index: number) => `0x${(index * 74 + 74).toString(16).toUpperCase().padStart(4, "0")}`;

// /trabalhos (arquetipo B): diretorio denso do sistema, com filtros por tipo.
const Work = () => {
  const { projects, configured } = useLoaderData() as WorksLoaderData;
  const [filtro, setFiltro] = useState<string>("todos");

  const categorias = useMemo(() => {
    const set = new Set(projects.map((p) => p.category || "projeto"));
    return ["todos", ...Array.from(set)];
  }, [projects]);

  const lista = filtro === "todos" ? projects : projects.filter((p) => (p.category || "projeto") === filtro);

  return (
    <>
      <Head>
        <title>Trabalhos | botellho</title>
        <meta
          name="description"
          content="Arquivo de trabalhos do botellho: sites institucionais, experiências 3D e WebGL, direção de arte e acervo digital para marcas, cultura e instituições."
        />
        <link rel="canonical" href="https://botellho.com/trabalhos" />
        <meta property="og:title" content="Trabalhos | botellho" />
        <meta property="og:description" content="Arquivo de trabalhos do botellho: do institucional ao imersivo, com a mesma régua de craft." />
        <meta property="og:url" content="https://botellho.com/trabalhos" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      <section className="px-4 pt-16 md:px-6 md:pt-24">
        <Typing text="> listando trabalhos" className="type-label text-muted-foreground" />
        <LineReveal as="h1" className="type-tese mt-8 max-w-4xl">O arquivo do estúdio.</LineReveal>
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
          Do institucional ao imersivo, a mesma régua de craft. Cada bloco é um
          case com contexto, conceito, abordagem e resultado.
        </p>

        {projects.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltro(cat)}
                className={`type-dos px-3 py-1 text-xs uppercase transition-colors ${
                  filtro === cat ? "bg-phosphor text-paper" : "border border-foreground/20 text-muted-foreground hover:border-phosphor"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="px-4 py-16 md:px-6 md:py-24">
        {projects.length === 0 ? (
          <p className="type-dos text-sm text-muted-foreground">
            {configured ? "[arquivo vazio] os primeiros cases chegam em breve." : "[arquivo offline] configure a fonte de dados para listar os cases."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {lista.map((project, index) => (
              <Link
                key={project.id}
                to={`/trabalhos/${project.slug}`}
                data-cursor-label="[ ver ]"
                className="group border border-foreground/15"
              >
                <div className="flex items-center justify-between border-b border-foreground/15 px-3 py-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{toHex(index)}</span>
                  <span className="type-label text-muted-foreground">{project.category || "projeto"}</span>
                </div>
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <ProjectMedia
                    project={project}
                    index={index}
                    className="h-full w-full object-cover grayscale contrast-[1.35] brightness-90 transition-[filter] duration-[320ms] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                  />
                </div>
                <div className="flex items-baseline justify-between px-3 py-4">
                  <h2 className="font-display text-2xl transition-colors group-hover:text-phosphor md:text-3xl">{project.title}</h2>
                  <span className="font-mono text-xs text-muted-foreground">abrir →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Work;
