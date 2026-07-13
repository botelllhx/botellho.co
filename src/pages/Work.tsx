import { Head } from "vite-react-ssg";
import { Link, useLoaderData } from "react-router-dom";
import LineReveal from "@/motion/LineReveal";
import Typing from "@/motion/Typing";
import type { WorksLoaderData } from "@/pages/workLoaders";

// O arquivo: indice de cases como tabela densa de terminal.
const toHex = (index: number) => `0x${(index * 74 + 74).toString(16).toUpperCase().padStart(4, "0")}`;

const Work = () => {
  const { projects, configured } = useLoaderData() as WorksLoaderData;

  return (
    <>
      <Head>
        <title>Trabalhos | botellho</title>
        <meta
          name="description"
          content="Arquivo de trabalhos do botellho: sites institucionais, experiências 3D e WebGL, direção de arte e acervo digital para marcas, cultura e instituições."
        />
        <link rel="canonical" href="https://botellho.com/work" />
        <meta property="og:title" content="Trabalhos | botellho" />
        <meta
          property="og:description"
          content="Arquivo de trabalhos do botellho: do institucional ao imersivo, com a mesma régua de craft."
        />
        <meta property="og:url" content="https://botellho.com/work" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      <section className="px-4 pt-16 md:px-6 md:pt-24">
        <Typing text="> ls /work" className="type-label text-muted-foreground" />
        <LineReveal as="h1" className="type-tese mt-8 max-w-4xl">
          O arquivo do estúdio.
        </LineReveal>
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
          Do institucional ao imersivo, a mesma régua de craft. Cada bloco é um
          case com contexto, conceito, abordagem e resultado.
        </p>
      </section>

      <section className="mt-16 border-t border-foreground/10 pb-24 md:pb-32">
        <div
          className="hidden grid-cols-[6rem_10rem_1fr_8rem] gap-4 border-b border-foreground/10 px-4 py-3 md:grid md:px-6"
          aria-hidden
        >
          {["endereço", "categoria", "projeto", "status"].map((coluna) => (
            <span key={coluna} className="type-label text-muted-foreground">
              {coluna}
            </span>
          ))}
        </div>

        {projects.length === 0 ? (
          <p className="type-dos mt-12 px-4 text-sm text-muted-foreground md:px-6">
            {configured
              ? "[arquivo vazio] os primeiros cases chegam em breve."
              : "[arquivo offline] configure a fonte de dados para listar os cases."}
          </p>
        ) : (
          <ul>
            {projects.map((project, index) => (
              <li key={project.id}>
                <Link
                  to={`/work/${project.slug}`}
                  className="dir-row grid grid-cols-1 gap-1 border-b border-foreground/10 px-4 py-5 md:grid-cols-[6rem_10rem_1fr_8rem] md:items-baseline md:gap-4 md:px-6"
                >
                  <span className="font-mono text-xs opacity-60">{toHex(index)}</span>
                  <span className="type-label opacity-60">{project.category || "projeto"}</span>
                  <h2 className="font-display text-2xl font-bold md:text-4xl">{project.title}</h2>
                  <span className="font-mono text-xs opacity-60">publicado</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default Work;
