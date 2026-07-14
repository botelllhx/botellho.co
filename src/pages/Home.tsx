import { Head } from "vite-react-ssg";
import { Link, useLoaderData } from "react-router-dom";
import LineReveal from "@/motion/LineReveal";
import SignalText from "@/motion/SignalText";
import Reveal from "@/motion/Reveal";
import Parallax from "@/motion/Parallax";
import CountUp from "@/motion/CountUp";
import PinnedRow from "@/motion/PinnedRow";
import SignatureCanvas from "@/webgl/SignatureCanvas";
import DioramaScene from "@/webgl/DioramaScene";
import SystemDivider from "@/system/SystemDivider";
import Window from "@/system/Window";
import ContactForm from "@/system/ContactForm";
import ProjectMedia from "@/system/ProjectMedia";
import type { WorksLoaderData } from "@/pages/workLoaders";

const SERVICOS = [
  { n: "01", nome: "Sites e plataformas", desc: "Presença digital com clareza, acessibilidade e confiança, do institucional ao produto." },
  { n: "02", nome: "Experiências e microsites", desc: "WebGL, 3D e motion para marcas, lançamentos, festivais e exposições. A experiência é a mensagem." },
  { n: "03", nome: "Direção de arte digital", desc: "O visual como diferencial, não como enfeite. Identidade que se move." },
  { n: "04", nome: "Cultura e instituições", desc: "Acervo, memória e patrimônio apresentados de um jeito que as pessoas querem explorar." },
  { n: "05", nome: "Parceria white-label", desc: "Construímos o front e as interações que outros estúdios e designers desenham." },
];

const SPECS = [
  { to: 60, suffix: "", label: "fps alvo, mesmo no android mediano" },
  { to: 6, suffix: "px", label: "bloco do bitmap, pixel fixo" },
  { to: 3, suffix: "", label: "tons: ink · paper · phosphor" },
  { to: 100, suffix: "%", label: "conteúdo em dom real, ótimo pra seo" },
];

const SETORES = ["Marcas", "Cultura e instituições", "Eventos e lançamentos", "Produto digital", "Educação"];

const PROCESSO = [
  { n: "01", nome: "Imersão", desc: "Entender o setor, o público e a obra antes de desenhar qualquer tela." },
  { n: "02", nome: "Conceito", desc: "A ideia que organiza tudo, a tese que o projeto vai defender." },
  { n: "03", nome: "Arte e engenharia", desc: "Direção de arte e construção andando juntas, nunca em sequência." },
  { n: "04", nome: "Craft", desc: "O detalhe do qual a gente se orgulha: o shader, a transição, o sistema." },
  { n: "05", nome: "No ar", desc: "Entrega medindo o que importa: performance, acessibilidade, memória." },
];

const FAQ = [
  { q: "Quanto custa um projeto?", a: "Trabalhamos por faixas, de R$ 10 mil a acima de R$ 60 mil, conforme escopo e ambição. A gente alinha isso na primeira conversa." },
  { q: "Quanto tempo leva?", a: "Depende do escopo. Um site institucional roda em semanas; uma experiência 3D pede mais fôlego. Combinamos o cronograma no começo." },
  { q: "Atendem fora de Belo Horizonte?", a: "Sim, o Brasil todo, de forma remota. O estúdio fica em BH, o trabalho vai onde precisa." },
  { q: "O que é uma experiência 3D ou WebGL?", a: "É web que roda gráfico 3D e motion no navegador, sem plugin. É a nossa assinatura técnica, o que faz o projeto durar na memória." },
];

const Home = () => {
  const { projects } = useLoaderData() as WorksLoaderData;
  const cases = projects.slice(0, 6);

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

      {/* ===== Hero (split; texto fora da tela) ===== */}
      <section className="px-4 pt-10 md:px-6 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <span className="type-label flex items-center gap-2 text-muted-foreground">
              <span className="text-phosphor">▚</span> Estúdio de web e experiências digitais
            </span>
            <h1 className="type-tese mt-5 max-w-2xl">
              <LineReveal as="span" className="block">Web que se move.</LineReveal>
              <span className="block text-phosphor"><SignalText text="Experiências digitais" delay={400} /></span>
              <LineReveal as="span" className="block" delay={0.14}>feitas para durar na memória.</LineReveal>
            </h1>
            <p className="mt-7 max-w-md font-sans text-base leading-relaxed text-muted-foreground">
              Craft de nível de prêmio em web e WebGL, para marcas, cultura e
              instituições que tratam o digital como experiência, não como folheto.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contato" className="cmd-button">Começar um projeto</Link>
              <Link to="/trabalhos" className="cmd-button-ghost">Ver trabalhos</Link>
            </div>
          </div>

          <Parallax amount={6}>
            <Window title="ban.exe" phosphor bodyClassName="!p-0">
              <div className="crt-frame aspect-[4/3] w-full !rounded-none border-0" data-cursor="3d">
                <SignatureCanvas
                  className="absolute inset-0"
                  crt={0.5}
                  camera={{ fov: 42, position: [-4, 2, 8] }}
                  fallback={<img src="/hero-fallback.png" alt="O estúdio do Ban, em bitmap" className="h-full w-full object-cover" style={{ imageRendering: "pixelated" }} />}
                >
                  <DioramaScene />
                </SignatureCanvas>
                <div className="crt-frame__glass !rounded-none" />
                <span className="crt-frame__tag type-label">estúdio // ao vivo</span>
              </div>
            </Window>
          </Parallax>
        </div>
      </section>

      {/* ===== Especificações (spec sheet, count-up, faixa dark) ===== */}
      <section className="dark mt-16 bg-background text-foreground md:mt-24">
        <div className="grid grid-cols-2 border-y border-foreground/15 md:grid-cols-4">
          {SPECS.map((spec, i) => (
            <div key={i} className="border-foreground/15 px-4 py-8 [&:not(:nth-child(2n))]:border-r md:border-r md:[&:last-child]:border-r-0 md:px-6">
              <span className="font-display text-4xl text-phosphor md:text-6xl">
                <CountUp to={spec.to} suffix={spec.suffix} />
              </span>
              <p className="mt-2 max-w-[16rem] font-mono text-[11px] uppercase leading-relaxed tracking-widest text-muted-foreground">{spec.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Manifesto teaser (editorial) ===== */}
      <section className="px-4 py-24 md:px-6 md:py-36">
        <Parallax amount={8}>
          <LineReveal as="p" className="type-tese max-w-5xl">
            A maior parte do digital é esquecível. A gente faz o <span className="text-phosphor">contrário</span>.
          </LineReveal>
        </Parallax>
        <p className="mt-10 max-w-2xl font-serif text-xl leading-relaxed text-muted-foreground md:text-2xl">
          Juntamos engenharia de verdade com direção de arte, do site
          institucional ao imersivo em 3D, sempre com a mesma régua de craft.
        </p>
        <Link to="/estudio" className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-phosphor hover:underline">conheça o estúdio ►</Link>
      </section>

      <SystemDivider label="O que fazemos" />

      {/* ===== O que fazemos (lista densa, glifos) ===== */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <ul className="border-t border-foreground/15">
          {SERVICOS.map((s) => (
            <Reveal as="li" key={s.n} className="dir-row grid grid-cols-[2.5rem_1fr] items-baseline gap-4 border-b border-foreground/15 px-2 py-7 md:grid-cols-[3rem_18rem_1fr] md:px-4">
              <span className="font-mono text-xs text-phosphor">{s.n}</span>
              <h2 className="flex items-baseline gap-3 font-display text-2xl md:text-3xl">{s.nome}</h2>
              <p className="col-start-2 max-w-lg font-sans text-sm leading-relaxed opacity-70 md:col-start-3">{s.desc}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <SystemDivider label="Trabalhos" ban />

      {/* ===== Trabalhos (galeria horizontal pinada, dark, previews em vídeo) ===== */}
      <section className="dark bg-background py-16 text-foreground md:py-24">
        <div className="flex items-end justify-between px-4 md:px-6">
          <LineReveal as="h2" className="type-title max-w-2xl">Trabalhos selecionados.</LineReveal>
          <Link to="/trabalhos" className="hidden font-mono text-sm text-phosphor hover:underline md:inline">ver todos ►</Link>
        </div>
        <div className="mt-12">
          <PinnedRow>
            {(cases.length > 0 ? cases : SERVICOS.slice(0, 4)).map((item, i) => {
              const p = cases[i];
              const to = p ? `/trabalhos/${p.slug}` : "/trabalhos";
              const titulo = p ? p.title : "Conceito";
              const setor = p ? p.category || "projeto" : "conceito";
              return (
                <Link key={i} to={to} data-cursor-label="[ ver ]" className="group block w-[82vw] flex-none border border-foreground/20 sm:w-[520px]">
                  <div className="crt-frame aspect-[16/10] w-full !rounded-none border-0" data-cursor="3d">
                    <ProjectMedia project={p} index={i} className="h-full w-full object-cover grayscale contrast-[1.4] brightness-90 transition-[filter] duration-[320ms] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100" />
                    <div className="crt-frame__glass !rounded-none" />
                  </div>
                  <div className="flex items-baseline justify-between px-4 py-4">
                    <div>
                      <span className="type-label text-phosphor">{setor}</span>
                      <h3 className="mt-1 font-display text-2xl transition-colors group-hover:text-phosphor">{titulo}</h3>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">abrir ►</span>
                  </div>
                </Link>
              );
            })}
          </PinnedRow>
        </div>
      </section>

      <SystemDivider label="Prova" />

      {/* ===== Prova / setores (split sticky) ===== */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <span className="type-label text-muted-foreground">Por que confiar</span>
            <LineReveal as="h2" className="type-title mt-5">Entendemos o setor cultural por dentro.</LineReveal>
            <p className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
              Leis de incentivo, editais, prestação de contas. É um porquê confiar, não a definição do estúdio.
            </p>
          </div>
          <div>
            <span className="type-label text-muted-foreground">Setores que atendemos</span>
            <ul className="mt-5 border-t border-foreground/15">
              {SETORES.map((setor, i) => (
                <Reveal as="li" key={setor} className="dir-row flex items-baseline gap-4 border-b border-foreground/15 px-2 py-5 md:px-4">
                  <span className="font-mono text-xs text-phosphor">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl md:text-3xl">{setor}</span>
                  <span className="ml-auto text-phosphor opacity-0 transition-opacity group-hover:opacity-100">►</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SystemDivider label="Como trabalhamos" />

      {/* ===== Processo (sticky + passos) ===== */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <span className="type-label text-muted-foreground">Processo</span>
            <LineReveal as="h2" className="type-title mt-5">Como trabalhamos.</LineReveal>
            <p className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
              Cinco passos, do entendimento do setor à medição no ar.
            </p>
          </div>
          <ol className="border-t border-foreground/15">
            {PROCESSO.map((passo) => (
              <Reveal as="li" key={passo.n} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-foreground/15 px-2 py-8 md:px-4">
                <span className="font-display text-2xl text-phosphor">{passo.n}</span>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl">{passo.nome}</h3>
                  <p className="mt-2 max-w-md font-sans text-sm leading-relaxed opacity-70">{passo.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <SystemDivider label="Perguntas" />

      {/* ===== FAQ (lista, sem janelas) ===== */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <LineReveal as="h2" className="type-title max-w-2xl">Perguntas frequentes.</LineReveal>
        <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {FAQ.map((item, i) => (
            <Reveal key={i} className="border-t border-foreground/15 pt-5">
              <h3 className="flex gap-3 font-display text-xl md:text-2xl">
                <span className="text-phosphor">►</span>
                {item.q}
              </h3>
              <p className="mt-3 pl-7 font-sans text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <SystemDivider label="Contato" ban />

      {/* ===== Contato embutido (janela, acento) ===== */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <Reveal>
          <Window title="começar um projeto" phosphor className="mx-auto max-w-3xl">
            <p className="mb-8 font-sans text-base text-muted-foreground">
              Conte o que você quer construir. Quanto mais específico, melhor a nossa resposta.
            </p>
            <ContactForm />
          </Window>
        </Reveal>
      </section>
    </>
  );
};

export default Home;
