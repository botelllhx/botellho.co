import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import LineReveal from "@/motion/LineReveal";
import SignalText from "@/motion/SignalText";
import SignatureCanvas from "@/webgl/SignatureCanvas";
import BanScene from "@/webgl/BanScene";
import { usePortfolioProjects } from "@/hooks/usePortfolioProjects";

// Programas da home: indice de servicos no formato de diretorio DOS.
const PROGRAMAS = [
  {
    num: "01",
    file: "sites-e-plataformas",
    desc: "Presença digital com clareza, acessibilidade e confiança, do institucional ao produto.",
  },
  {
    num: "02",
    file: "experiencias-e-microsites",
    desc: "WebGL, 3D e motion para marcas, lançamentos, festivais e exposições. A experiência é a mensagem.",
  },
  {
    num: "03",
    file: "direcao-de-arte",
    desc: "Identidade digital com o visual como diferencial, não como enfeite.",
  },
  {
    num: "04",
    file: "acervo-e-patrimonio",
    desc: "Para cultura e instituições: coleções e memória apresentadas de um jeito que as pessoas querem explorar.",
  },
  {
    num: "05",
    file: "white-label",
    desc: "Construímos o front e as interações que outros estúdios e designers desenham.",
  },
];

const toHex = (index: number) => `0x${(index * 74 + 74).toString(16).toUpperCase().padStart(4, "0")}`;

const Home = () => {
  const { projects } = usePortfolioProjects();

  return (
    <>
      <Head>
        <title>botellho | Estúdio de web e experiências digitais</title>
        <meta
          name="description"
          content="Web que se move: sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições. Estúdio brasileiro de web e experiências digitais."
        />
        <link rel="canonical" href="https://botellho.com/" />
        <meta property="og:title" content="botellho | Estúdio de web e experiências digitais" />
        <meta
          property="og:description"
          content="Sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições."
        />
        <meta property="og:url" content="https://botellho.com/" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
        <meta name="twitter:title" content="botellho | Estúdio de web e experiências digitais" />
        <meta
          name="twitter:description"
          content="Sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições."
        />
        <meta name="twitter:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      {/* ===== Hero: o Ban na tela ===== */}
      <section className="relative overflow-hidden px-4 md:px-6">
        <div className="grid min-h-[calc(100svh-var(--bar-h))] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Texto */}
          <div className="order-2 lg:order-1">
            <span className="type-label text-muted-foreground">
              &gt; estúdio de web e experiências digitais
            </span>
            <h1 className="type-tese mt-6 max-w-2xl">
              <LineReveal as="span" className="block">
                Web que se move.
              </LineReveal>
              <span className="block text-phosphor">
                <SignalText text="Experiências digitais" delay={500} />
              </span>
              <LineReveal as="span" className="block" delay={0.16}>
                feitas para durar na memória.
              </LineReveal>
            </h1>

            <p className="mt-8 max-w-md font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
              Estúdio de web e WebGL com craft de nível de prêmio, para marcas,
              cultura e instituições que tratam o digital como experiência, não
              como folheto.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contato" className="cmd-button">
                Começar um projeto
              </Link>
              <Link to="/trabalhos" className="cmd-button-ghost">
                Ver trabalhos
              </Link>
            </div>
          </div>

          {/* A tela CRT com o Ban 3D */}
          <div className="order-1 lg:order-2">
            <div className="crt-frame aspect-[4/3] w-full" data-cursor="3d">
              <SignatureCanvas
                className="absolute inset-0"
                crt={0.5}
                camera={{ fov: 34, position: [0.2, 0.5, 6.2] }}
                fallback={
                  <img
                    src="/ban/ban-1.png"
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-contain p-8"
                  />
                }
              >
                <BanScene />
              </SignatureCanvas>
              <div className="crt-frame__glass" />
              <span className="crt-frame__tag type-label">ban // idle</span>
            </div>
          </div>
        </div>

        <div className="rule" />
      </section>

      {/* ===== Índice de programas ===== */}
      <section className="px-4 py-24 md:px-6 md:py-32">
        <div className="flex items-baseline justify-between">
          <span className="type-label text-muted-foreground">&gt; dir /o-que-fazemos</span>
          <span className="type-label hidden text-muted-foreground md:block">5 programas</span>
        </div>

        <LineReveal as="h2" className="type-title mt-8 max-w-3xl">
          O que este estúdio executa.
        </LineReveal>

        <ul className="mt-14 border-t border-foreground/10">
          {PROGRAMAS.map((programa) => (
            <li
              key={programa.file}
              className="dir-row grid grid-cols-[2.5rem_1fr] gap-4 border-b border-foreground/10 px-2 py-6 md:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1fr)] md:items-baseline md:px-4"
            >
              <span className="font-mono text-xs text-muted-foreground">{programa.num}</span>
              <h3 className="font-display text-xl font-bold md:text-3xl">
                {programa.file}
                <span className="text-phosphor">.exe</span>
              </h3>
              <p className="col-start-2 max-w-md font-sans text-sm leading-relaxed opacity-70 md:col-start-3">
                {programa.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== Memória (trabalhos selecionados) ===== */}
      <section className="border-t border-foreground/10 py-24 md:py-32">
        <div className="flex items-baseline justify-between px-4 md:px-6">
          <span className="type-label text-muted-foreground">&gt; memória / trabalhos</span>
          <Link to="/trabalhos" className="type-label text-phosphor hover:underline">
            ver arquivo completo →
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="type-dos mt-14 px-4 text-sm text-muted-foreground md:px-6">
            [memória vazia] os primeiros blocos chegam em breve.
          </p>
        ) : (
          <div className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:px-6">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                to={`/trabalhos/${project.slug}`}
                className="group w-[76vw] flex-none snap-start border border-foreground/15 sm:w-[420px]"
              >
                <div className="flex items-center justify-between border-b border-foreground/15 px-3 py-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{toHex(index)}</span>
                  <span className="type-label text-muted-foreground">
                    {project.category || "projeto"}
                  </span>
                </div>
                {project.cover_media_url ? (
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={project.cover_media_url}
                      alt={`Capa do projeto ${project.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale contrast-125 transition-[filter] duration-[320ms] group-hover:grayscale-0 group-hover:contrast-100"
                    />
                  </div>
                ) : (
                  <div className="type-dos flex aspect-[4/3] items-center justify-center bg-muted text-phosphor">
                    [sem visual]
                  </div>
                )}
                <div className="flex items-center justify-between px-3 py-3">
                  <h3 className="font-display text-lg font-bold transition-colors group-hover:text-phosphor">
                    {project.title}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">abrir →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== Chamada final ===== */}
      <section className="border-t border-foreground/10 px-4 py-24 md:px-6 md:py-32">
        <span className="type-label text-muted-foreground">&gt; próximo comando</span>
        <LineReveal as="h2" className="type-tese mt-8 max-w-4xl">
          Tem um projeto que merece ser lembrado?
        </LineReveal>
        <Link to="/contato" className="cmd-button mt-10">
          Começar um projeto
        </Link>
      </section>
    </>
  );
};

export default Home;
