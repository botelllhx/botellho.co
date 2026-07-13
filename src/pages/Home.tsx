import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import LineReveal from "@/motion/LineReveal";
import SignalText from "@/motion/SignalText";
import SystemDivider from "@/system/SystemDivider";
import Window from "@/system/Window";
import ContactForm from "@/system/ContactForm";
import { usePortfolioProjects } from "@/hooks/usePortfolioProjects";

const SERVICOS = [
  { n: "01", nome: "Sites e plataformas", desc: "Presença digital com clareza, acessibilidade e confiança, do institucional ao produto." },
  { n: "02", nome: "Experiências e microsites", desc: "WebGL, 3D e motion para marcas, lançamentos, festivais e exposições. A experiência é a mensagem." },
  { n: "03", nome: "Direção de arte digital", desc: "O visual como diferencial, não como enfeite. Identidade que se move." },
  { n: "04", nome: "Cultura e instituições", desc: "Acervo, memória e patrimônio apresentados de um jeito que as pessoas querem explorar." },
  { n: "05", nome: "Parceria white-label", desc: "Construímos o front e as interações que outros estúdios e designers desenham." },
];

const SETORES = ["Marcas", "Cultura e instituições", "Eventos e lançamentos", "Produto digital", "Educação"];

const FAQ = [
  { q: "Quanto custa um projeto?", a: "Trabalhamos por faixas, de R$ 10 mil a acima de R$ 60 mil, conforme escopo e ambição. A gente alinha isso na primeira conversa." },
  { q: "Quanto tempo leva?", a: "Depende do escopo. Um site institucional roda em semanas; uma experiência 3D pede mais fôlego. Combinamos o cronograma no começo." },
  { q: "Atendem fora de Belo Horizonte?", a: "Sim, o Brasil todo, de forma remota. O estúdio fica em BH, o trabalho vai onde precisa." },
  { q: "O que é uma experiência 3D ou WebGL?", a: "É web que roda gráfico 3D e motion no navegador, sem plugin. É a nossa assinatura técnica, o que faz o projeto durar na memória." },
];

const PREVIEW = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=60&auto=format",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=60&auto=format",
  "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=900&q=60&auto=format",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=60&auto=format",
];

const Home = () => {
  const { projects } = usePortfolioProjects();
  const cases = projects.slice(0, 4);

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

      {/* ===== Hero (editorial split; texto fora da tela) ===== */}
      <section className="px-4 pt-10 md:px-6 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <span className="type-label text-muted-foreground">Estúdio de web e experiências digitais</span>
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

          {/* A tela CRT como janela; placeholder bitmap estatico (3D vem depois) */}
          <Window title="ban.exe" phosphor bodyClassName="!p-0">
            <div className="crt-frame aspect-[4/3] w-full !rounded-none border-0" data-cursor="3d">
              <img src="/hero-fallback.png" alt="O estúdio do Ban, em bitmap" className="h-full w-full object-cover" style={{ imageRendering: "pixelated" }} />
              <div className="crt-frame__glass !rounded-none" />
            </div>
          </Window>
        </div>
      </section>

      <SystemDivider label="O que fazemos" />

      {/* ===== O que fazemos (index/list denso numa janela) ===== */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <Window title="serviços" bodyClassName="!p-0">
          <ul>
            {SERVICOS.map((s) => (
              <li key={s.n} className="dir-row grid grid-cols-[2.5rem_1fr] items-baseline gap-4 border-b border-foreground/12 px-4 py-6 last:border-0 md:grid-cols-[3rem_16rem_1fr] md:px-6">
                <span className="font-mono text-xs text-phosphor">{s.n}</span>
                <h2 className="font-display text-xl md:text-2xl">{s.nome}</h2>
                <p className="col-start-2 max-w-lg font-sans text-sm leading-relaxed opacity-70 md:col-start-3">{s.desc}</p>
              </li>
            ))}
          </ul>
        </Window>
      </section>

      <SystemDivider label="Trabalhos" ban />

      {/* ===== Seleção de trabalhos (media grid, seção dark premium) ===== */}
      <section className="dark bg-background px-4 py-20 text-foreground md:px-6 md:py-28">
        <div className="flex items-end justify-between">
          <LineReveal as="h2" className="type-title max-w-2xl">Trabalhos selecionados.</LineReveal>
          <Link to="/trabalhos" className="hidden font-mono text-sm text-phosphor hover:underline md:inline">ver todos ►</Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {(cases.length > 0 ? cases : SERVICOS.slice(0, 4)).map((item, i) => {
            const p = cases[i];
            const to = p ? `/trabalhos/${p.slug}` : "/trabalhos";
            const titulo = p ? p.title : "Conceito";
            const setor = p ? p.category || "projeto" : "conceito";
            const img = p?.cover_media_url || PREVIEW[i];
            return (
              <Link key={i} to={to} data-cursor-label="[ ver ]" className="group block border border-foreground/20">
                <div className="aspect-[16/10] overflow-hidden bg-ink">
                  <img src={img} alt={`Prévia de ${titulo}`} loading="lazy" className="h-full w-full object-cover grayscale contrast-[1.4] brightness-90 transition-[filter] duration-[320ms] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100" />
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
        </div>
      </section>

      <SystemDivider label="Prova" />

      {/* ===== Prova (split-screen sticky) ===== */}
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
                <li key={setor} className="dir-row flex items-baseline gap-4 border-b border-foreground/15 px-2 py-5 md:px-4">
                  <span className="font-mono text-xs text-phosphor">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl md:text-3xl">{setor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SystemDivider label="Perguntas" ban />

      {/* ===== Processo / FAQ (stacking em janelas) ===== */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <LineReveal as="h2" className="type-title max-w-2xl">Perguntas frequentes.</LineReveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {FAQ.map((item, i) => (
            <Window key={i} title={`0${i + 1} · dúvida`}>
              <h3 className="font-display text-xl">{item.q}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </Window>
          ))}
        </div>
      </section>

      <SystemDivider label="Contato" />

      {/* ===== Contato embutido (janela) ===== */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <Window title="começar um projeto" phosphor className="mx-auto max-w-3xl">
          <p className="mb-8 font-sans text-base text-muted-foreground">
            Conte o que você quer construir. Quanto mais específico, melhor a nossa resposta.
          </p>
          <ContactForm />
        </Window>
      </section>
    </>
  );
};

export default Home;
