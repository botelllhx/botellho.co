import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import LineReveal from "@/motion/LineReveal";
import SignalText from "@/motion/SignalText";
import SignatureCanvas from "@/webgl/SignatureCanvas";
import DioramaScene from "@/webgl/DioramaScene";
import SystemDivider from "@/system/SystemDivider";
import ContactForm from "@/system/ContactForm";
import { usePortfolioProjects } from "@/hooks/usePortfolioProjects";

const PROGRAMAS = [
  { num: "01", file: "sites-e-plataformas", desc: "Presença digital com clareza, acessibilidade e confiança, do institucional ao produto." },
  { num: "02", file: "experiencias-e-microsites", desc: "WebGL, 3D e motion para marcas, lançamentos, festivais e exposições. A experiência é a mensagem." },
  { num: "03", file: "direcao-de-arte", desc: "Identidade digital com o visual como diferencial, não como enfeite." },
  { num: "04", file: "acervo-e-patrimonio", desc: "Para cultura e instituições: coleções e memória que as pessoas querem explorar." },
  { num: "05", file: "white-label", desc: "Construímos o front e as interações que outros estúdios e designers desenham." },
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
        <meta property="og:description" content="Sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições." />
        <meta property="og:url" content="https://botellho.com/" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
        <meta name="twitter:title" content="botellho | Estúdio de web e experiências digitais" />
        <meta name="twitter:description" content="Sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições." />
        <meta name="twitter:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      {/* ===== A · Hero: o estudio-diorama do Ban (cena cheia) ===== */}
      <section className="relative min-h-[calc(100svh-var(--bar-h))] overflow-hidden" data-cursor="3d">
        <SignatureCanvas
          className="absolute inset-0"
          crt={0.5}
          camera={{ fov: 42, position: [-3.2, 1.4, 7.5] }}
          fallback={<img src="/hero-fallback.png" alt="" loading="lazy" className="h-full w-full object-cover" />}
        >
          <DioramaScene />
        </SignatureCanvas>
        <div className="hero-glass" />

        <div className="relative z-10 flex min-h-[calc(100svh-var(--bar-h))] flex-col justify-end px-4 pb-16 md:px-6 md:pb-20">
          <span className="type-label text-phosphor">&gt; estúdio de web e experiências digitais</span>
          <h1 className="type-tese mt-6 max-w-4xl text-paper">
            <LineReveal as="span" className="block">Web que se move.</LineReveal>
            <span className="block text-phosphor"><SignalText text="Experiências digitais" delay={500} /></span>
            <LineReveal as="span" className="block" delay={0.16}>feitas para durar na memória.</LineReveal>
          </h1>
          <p className="mt-8 max-w-md font-sans text-sm leading-relaxed text-paper/70 md:text-base">
            Estúdio de web e WebGL com craft de nível de prêmio, para marcas,
            cultura e instituições que tratam o digital como experiência, não como folheto.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contato" className="cmd-button">Começar um projeto</Link>
            <Link to="/trabalhos" className="cmd-button-ghost !text-paper !border-paper/40">Ver trabalhos</Link>
          </div>
        </div>
      </section>

      <SystemDivider text="o que fazemos" />

      {/* ===== B · O que fazemos: grid denso, secao ink (preta) ===== */}
      <section className="dark bg-background px-4 py-24 text-foreground md:px-6 md:py-32">
        <div className="flex items-baseline justify-between">
          <span className="type-label text-muted-foreground">&gt; dir /o-que-fazemos</span>
          <span className="type-label hidden text-muted-foreground md:block">5 programas</span>
        </div>
        <LineReveal as="h2" className="type-title mt-8 max-w-3xl">O que este estúdio executa.</LineReveal>

        <ul className="mt-14 border-t border-foreground/15">
          {PROGRAMAS.map((p) => (
            <li key={p.file} className="dir-row grid grid-cols-[2.5rem_1fr] gap-4 border-b border-foreground/15 px-2 py-6 md:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1fr)] md:items-baseline md:px-4">
              <span className="font-mono text-xs text-phosphor">{p.num}</span>
              <h3 className="font-display text-xl md:text-3xl">{p.file}<span className="text-phosphor">.exe</span></h3>
              <p className="col-start-2 max-w-md font-sans text-sm leading-relaxed opacity-70 md:col-start-3">{p.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <SystemDivider text="memória / trabalhos" ban />

      {/* ===== A/B · Seleção de trabalhos: faixa horizontal, secao paper ===== */}
      <section className="px-4 py-24 md:px-6 md:py-32">
        <div className="flex items-baseline justify-between">
          <span className="type-label text-muted-foreground">&gt; memória / trabalhos</span>
          <Link to="/trabalhos" className="type-label text-phosphor hover:underline">ver arquivo completo →</Link>
        </div>
        <LineReveal as="h2" className="type-title mt-8 max-w-3xl">Blocos de memória.</LineReveal>

        {projects.length === 0 ? (
          <p className="type-dos mt-12 text-sm text-muted-foreground">[memória vazia] os primeiros blocos chegam em breve.</p>
        ) : (
          <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                to={`/trabalhos/${project.slug}`}
                data-cursor-label="[ ver ]"
                className="group w-[78vw] flex-none snap-start border border-foreground/15 sm:w-[380px]"
              >
                <div className="flex items-center justify-between border-b border-foreground/15 px-3 py-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{toHex(index)}</span>
                  <span className="type-label text-muted-foreground">{project.category || "projeto"}</span>
                </div>
                {project.cover_media_url ? (
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={project.cover_media_url}
                      alt={`Capa do projeto ${project.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale contrast-[1.35] brightness-90 transition-[filter] duration-[320ms] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                    />
                  </div>
                ) : (
                  <div className="type-dos flex aspect-[4/3] items-center justify-center bg-muted text-phosphor">[sem visual]</div>
                )}
                <div className="flex items-center justify-between px-3 py-3">
                  <h3 className="font-display text-lg transition-colors group-hover:text-phosphor">{project.title}</h3>
                  <span className="font-mono text-xs text-muted-foreground">abrir →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <SystemDivider text="manifesto" />

      {/* ===== C · Manifesto teaser: editorial, secao ink ===== */}
      <section className="dark bg-background px-4 py-28 text-foreground md:px-6 md:py-40">
        <span className="type-label text-muted-foreground">&gt; manifesto</span>
        <LineReveal as="p" className="type-tese mt-8 max-w-5xl">
          A maior parte do digital é esquecível. A gente faz o <span className="text-phosphor">contrário</span>.
        </LineReveal>
        <p className="mt-10 max-w-2xl font-serif text-xl leading-relaxed text-foreground/80 md:text-2xl">
          Juntamos engenharia de verdade com direção de arte, do site institucional
          ao imersivo em 3D, sempre com a mesma régua de craft.
        </p>
        <Link to="/estudio" className="mt-10 inline-block font-mono text-sm text-phosphor hover:underline">
          conheça o estúdio →
        </Link>
      </section>

      <SystemDivider text="contato" ban />

      {/* ===== D · Contato embutido: janela de terminal, secao paper ===== */}
      <section className="px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-3xl border border-foreground/20">
          <div className="flex items-center justify-between border-b border-foreground/20 px-4 py-2">
            <span className="type-dos text-xs text-phosphor">contato.exe</span>
            <span className="type-label text-muted-foreground">botellho</span>
          </div>
          <div className="p-5 md:p-8">
            <p className="type-dos mb-8 text-sm text-phosphor">&gt; pronto para começar um projeto?</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
