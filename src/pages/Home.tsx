import { useState } from "react";
import { Head } from "vite-react-ssg";
import { Link, useLoaderData } from "react-router-dom";
import Scramble from "@/motion/Scramble";
import Reveal from "@/motion/Reveal";
import Window from "@/system/Window";
import ContactForm from "@/system/ContactForm";
import ProjectMedia from "@/system/ProjectMedia";
import ScatterField from "@/system/ScatterField";
import GifList from "@/system/GifList";
import RetroDesktop from "@/system/RetroDesktop";
import HeroDiorama from "@/webgl/HeroDiorama";
import type { WorksLoaderData } from "@/pages/workLoaders";

const SERVICOS = [
  { n: "01", nome: "Sites e plataformas", img: "/ban/ban-2.png", desc: "Presença digital com clareza, acessibilidade e confiança, do institucional ao produto." },
  { n: "02", nome: "Experiências 3D e WebGL", img: "/ban/ban-3.png", desc: "3D, motion e experiência para marcas, lançamentos e exposições. A experiência é a mensagem." },
  { n: "03", nome: "Direção de arte digital", img: "/ban/ban-4.png", desc: "O visual como diferencial, não como enfeite. Identidade que se move." },
  { n: "04", nome: "Cultura e instituições", img: "/ban/ban-5.png", desc: "Acervo, memória e patrimônio de um jeito que as pessoas querem explorar." },
  { n: "05", nome: "Parceria white-label", img: "/ban/ban-1.png", desc: "Construímos o front e as interações que outros estúdios desenham." },
];

const SETORES = [
  "Marcas e lançamentos",
  "Cultura e instituições",
  "Educação",
  "Produto digital",
  "Ecommerce e varejo",
  "Eventos e experiências",
  "Editorial e conteúdo",
  "Tecnologia e startups",
  "Imobiliário e arquitetura",
  "Saúde e bem-estar",
];

const Home = () => {
  const { projects } = useLoaderData() as WorksLoaderData;
  const cases = projects.slice(0, 6);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <>
      <Head>
        <title>botellho | Estúdio de web e experiências digitais</title>
        <meta name="description" content="Web que se move: sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições. Estúdio brasileiro de web e experiências digitais." />
        <link rel="canonical" href="https://botellho.com/" />
        <meta property="og:title" content="botellho | Estúdio de web e experiências digitais" />
        <meta property="og:description" content="Sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições." />
        <meta property="og:url" content="https://botellho.com/" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
        <meta name="twitter:title" content="botellho | Estúdio de web e experiências digitais" />
        <meta name="twitter:description" content="Sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições." />
        <meta name="twitter:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      {/* ===== 1 · Hero: estudio-diorama do Ban (cena crua, sem texto por enquanto) ===== */}
      <section className="sticky top-[var(--bar-h)] z-0 bg-background" data-cursor="3d">
        <HeroDiorama />
      </section>

      {/* O resto empilha sobre o hero (stacking) */}
      <div className="relative z-10">
        {/* ===== 2 · Manifesto (azul; declaracao gigante + codigo misturado, basement/dos) ===== */}
        <section className="flex min-h-screen flex-col justify-center bg-phosphor px-4 py-24 text-paper md:px-6">
          <div className="flex items-center justify-between border-b border-paper/25 pb-4 font-mono text-[11px] uppercase tracking-widest text-paper/55">
            <span>manifesto</span>
            <span className="normal-case tracking-normal">02 / 08</span>
          </div>

          <div className="flex flex-1 items-center py-14">
            <Scramble as="p" text="A maior parte do digital é esquecível. A gente faz o contrário." className="block font-display leading-[0.9] tracking-[-0.02em] text-[clamp(2.75rem,8.4vw,10rem)]" duration={1100} />
          </div>

          <div className="grid gap-8 border-t border-paper/25 pt-8 md:grid-cols-[minmax(0,auto)_1fr_auto] md:items-end">
            <pre className="hidden font-mono text-xs leading-relaxed text-paper/55 md:block" aria-hidden>{`// o método
craft = engenharia
      + direção de arte`}</pre>
            <p className="max-w-xl font-sans text-lg leading-relaxed text-paper/80 md:text-xl">
              Juntamos engenharia de verdade com direção de arte, do site
              institucional ao imersivo em 3D, sempre com a mesma régua de craft.
            </p>
            <Link to="/estudio" className="shrink-0 font-mono text-sm text-paper underline-offset-4 hover:underline">conheça o estúdio ►</Link>
          </div>
        </section>

        {/* ===== 3 · O que fazemos (branco; lista gigante com hover, AREA17) ===== */}
        <section className="relative overflow-hidden bg-background px-4 py-20 md:px-6 md:py-28">
          <span className="type-label text-muted-foreground">o que fazemos</span>
          <ul className="mt-8 border-t border-foreground/15">
            {SERVICOS.map((s, i) => (
              <li
                key={s.n}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="group relative border-b border-foreground/15"
              >
                <div className="flex items-baseline gap-4 py-6 transition-transform duration-300 md:group-hover:translate-x-4">
                  <span className="font-mono text-xs text-phosphor">{s.n}</span>
                  <h2 className="font-display text-4xl leading-none transition-colors group-hover:text-phosphor md:text-7xl">{s.nome}</h2>
                  <span className="ml-auto hidden text-3xl text-phosphor opacity-0 transition-opacity group-hover:opacity-100 md:block">►</span>
                </div>
                <p className="max-w-md pb-6 pl-8 font-sans text-sm leading-relaxed text-muted-foreground md:hidden">{s.desc}</p>
              </li>
            ))}
          </ul>
          {/* imagem bitmap revelada no hover (desktop) */}
          <div className="pointer-events-none absolute right-6 top-1/2 hidden h-72 w-72 -translate-y-1/2 md:block">
            {SERVICOS.map((s, i) => (
              <img
                key={s.n}
                src={s.img}
                alt=""
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${hover === i ? "opacity-100" : "opacity-0"}`}
                style={{ imageRendering: "pixelated" }}
              />
            ))}
          </div>
        </section>

        {/* ===== 4 · Trabalhos (azul; media grid com previews gigantes) ===== */}
        <section className="bg-phosphor px-4 py-20 text-paper md:px-6 md:py-28">
          <div className="flex items-end justify-between">
            <Scramble as="h2" text="Trabalhos selecionados." className="type-title max-w-2xl" />
            <Link to="/trabalhos" className="hidden font-mono text-sm text-paper underline-offset-4 hover:underline md:inline">ver todos ►</Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {(cases.length > 0 ? cases : [null, null]).map((p, i) => {
              const to = p ? `/trabalhos/${p.slug}` : "/trabalhos";
              const titulo = p ? p.title : "Conceito";
              const setor = p ? p.category || "projeto" : "conceito";
              return (
                <Reveal as="div" key={i}>
                  <Link to={to} data-cursor-label="[ ver ]" className="group block border border-paper/25">
                    <div className="aspect-[16/10] overflow-hidden bg-ink">
                      <ProjectMedia project={p} index={i} className="h-full w-full object-cover grayscale contrast-[1.4] transition-[filter] duration-300 group-hover:grayscale-0" />
                    </div>
                    <div className="flex items-baseline justify-between px-4 py-4">
                      <div>
                        <span className="type-label text-paper/60">{setor}</span>
                        <h3 className="mt-1 font-display text-2xl md:text-3xl">{titulo}</h3>
                      </div>
                      <span className="font-mono text-xs text-paper/70">abrir ►</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ===== 5 · Campo de blocos (branco, blocos azuis, >100vh) ===== */}
        <ScatterField />

        {/* ===== 6 · Regras da casa (azul; lista gigante centralizada com gif no hover) ===== */}
        <GifList />

        {/* ===== 7 · Prova / atuacoes (branco; split sticky, leque aberto) ===== */}
        <section className="bg-background px-4 py-20 md:px-6 md:py-28">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div className="md:sticky md:top-24 md:self-start">
              <span className="type-label text-muted-foreground">por que confiar</span>
              <Scramble as="h2" text="A mesma régua de craft em qualquer setor." className="type-title mt-5" />
              <p className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
                Do institucional ao experimental, cada projeto recebe a mesma
                exigência técnica e visual. O setor muda, a régua não.
              </p>
            </div>
            <ul className="border-t border-foreground/15">
              {SETORES.map((setor, i) => (
                <Reveal as="li" key={setor} className="dir-row flex items-baseline gap-4 border-b border-foreground/15 px-2 py-5 md:px-4">
                  <span className="font-mono text-xs text-phosphor">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl md:text-4xl">{setor}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== 8 · Contato (azul; desktop retro, janela arrastavel presa a area) ===== */}
        <section className="bg-phosphor px-4 py-16 text-paper md:px-6 md:py-24">
          <div className="mb-8 flex items-center justify-between border-b border-paper/25 pb-4 font-mono text-[11px] uppercase tracking-widest text-paper/55">
            <span>contato</span>
            <span className="normal-case tracking-normal">08 / 08</span>
          </div>
          <RetroDesktop>
            <Window title="começar_um_projeto.exe" phosphor draggable bounded className="w-full max-w-2xl text-foreground">
              <p className="mb-8 font-sans text-base text-muted-foreground">
                Conte o que você quer construir. Quanto mais específico, melhor a
                nossa resposta. Arraste a janela pela barra se quiser.
              </p>
              <ContactForm />
            </Window>
          </RetroDesktop>
        </section>
      </div>
    </>
  );
};

export default Home;
