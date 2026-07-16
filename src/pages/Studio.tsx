import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import Scramble from "@/motion/Scramble";
import Reveal from "@/motion/Reveal";
import Typing from "@/motion/Typing";
import Window from "@/system/Window";
import HeroDiorama from "@/webgl/HeroDiorama";

const FAZEMOS = [
  { nome: "sites e plataformas", desc: "Do institucional ao produto: presença digital com clareza, acessibilidade e performance, construída à mão." },
  { nome: "experiências 3d e webgl", desc: "3D, motion e imersivo para marcas, lançamentos e exposições. A experiência é a própria mensagem." },
  { nome: "direção de arte digital", desc: "O visual como diferencial, não como enfeite. Uma identidade que se move e se lembra." },
  { nome: "cultura e instituições", desc: "Acervo, memória e patrimônio de um jeito que as pessoas realmente querem explorar." },
];

const PASSOS = [
  { num: "01", nome: "imersão", desc: "Entender o setor, o público e o objetivo antes de desenhar qualquer tela." },
  { num: "02", nome: "conceito", desc: "A ideia que organiza tudo: a tese que o projeto vai defender." },
  { num: "03", nome: "arte + engenharia", desc: "Direção de arte e construção andando juntas, nunca em sequência." },
  { num: "04", nome: "craft", desc: "O detalhe do qual a gente se orgulha: o shader, a transição, o sistema." },
  { num: "05", nome: "no ar", desc: "Entrega medindo o que importa: performance, acessibilidade e SEO." },
];

const CRENCAS = [
  { titulo: "engenharia e arte na mesma mesa", img: "/ban/ban-2.png", desc: "Direção de arte e código não se revezam: acontecem juntos, do briefing ao deploy." },
  { titulo: "o detalhe é o produto", img: "/ban/ban-4.png", desc: "O shader, a transição, o microcopy. É no detalhe que mora a diferença entre bom e memorável." },
  { titulo: "web aberta, rápida e acessível", img: "/ban/ban-5.png", desc: "Performance e acessibilidade não são extras: são parte do craft, medidas em toda entrega." },
];

const COM_QUEM = [
  "Marcas e lançamentos",
  "Cultura e instituições",
  "Educação",
  "Produto digital",
  "Estúdios parceiros (white-label)",
];

const Studio = () => {
  return (
    <>
      <Head>
        <title>Estúdio | botellho</title>
        <meta name="description" content="botellho é um estúdio de web e experiências digitais. Engenharia e direção de arte na mesma mesa, do site institucional ao imersivo em 3D, com craft de nível de prêmio." />
        <link rel="canonical" href="https://botellho.com/estudio" />
        <meta property="og:title" content="Estúdio | botellho" />
        <meta property="og:description" content="Estúdio de web e experiências digitais para marcas, cultura e instituições que querem ser lembradas." />
        <meta property="og:url" content="https://botellho.com/estudio" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      {/* ===== 1 · Abertura (branco, sticky): identidade + janela com o Ban ===== */}
      <section className="sticky top-[var(--bar-h)] z-0 bg-background px-4 md:px-6">
        <div className="grid min-h-[calc(100svh-var(--bar-h))] items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Typing text="> estúdio" className="type-label text-muted-foreground" />
            <h1 className="type-tese mt-6">
              <Scramble as="span" text="estúdio de" className="block" onMount />
              <Scramble as="span" text="web & experiências" className="block" onMount delay={160} />
            </h1>
            <p className="mt-8 max-w-md font-sans text-lg leading-relaxed text-muted-foreground">
              botellho junta engenharia de verdade com direção de arte, do site
              institucional ao imersivo em 3D, sempre com a mesma régua de craft.
              Para marcas, cultura e instituições que querem ser lembradas.
            </p>
          </div>

          {/* o mesmo diorama do hero, mas abrindo focado NA TELA — que roda o
              boot com os servicos do estudio. Clicar puxa a camera pra tras e
              revela o estudio inteiro. */}
          <Window title="estudio.exe" phosphor bodyClassName="!p-0">
            <div className="relative aspect-[4/3]" data-cursor="nativo">
              <HeroDiorama focoInicial="Monitor" className="h-full" />
              <span className="crt-frame__tag type-label !text-foreground/60">clique para revelar o estúdio</span>
            </div>
          </Window>
        </div>
      </section>

      {/* O resto empilha sobre a abertura (stacking, como na home) */}
      <div className="relative z-10">
        {/* ===== 2 · Manifesto (azul): declaracao gigante full-width ===== */}
        <section className="flex min-h-screen flex-col justify-center bg-phosphor px-4 py-24 text-paper md:px-6">
          <div className="flex items-center justify-between border-b border-paper/25 pb-4 font-mono text-[11px] uppercase tracking-widest text-paper/55">
            <span>manifesto</span>
            <span className="normal-case tracking-normal">/estudio/manifesto.txt</span>
          </div>

          <div className="flex flex-1 items-center py-14">
            <Scramble as="p" text="Um site pode ser tão bem construído quanto aquilo que ele apresenta." className="block font-display leading-[0.9] tracking-[-0.02em] text-[clamp(2.75rem,8.4vw,10rem)]" duration={1100} />
          </div>

          <p className="max-w-xl border-t border-paper/25 pt-6 font-sans text-lg leading-relaxed text-paper/80 md:text-xl">
            Craft não é enfeite: é o que separa o memorável do esquecível. E é a
            única régua que a gente aplica igual, do institucional ao experimental.
          </p>
        </section>

        {/* ===== 3 · O que fazemos (branco): grid 2x2 a la basement ===== */}
        <section className="bg-background px-4 py-20 md:px-6 md:py-28">
          <span className="type-label text-muted-foreground">o que fazemos</span>
          <div className="mt-10 grid gap-x-10 gap-y-14 border-t border-foreground/15 pt-12 md:grid-cols-2 md:gap-x-16">
            {FAZEMOS.map((f) => (
              <Reveal as="div" key={f.nome}>
                <span className="font-mono text-xs uppercase tracking-widest text-phosphor">{f.nome}</span>
                <p className="mt-4 font-sans text-2xl font-medium leading-snug text-foreground md:text-3xl">{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===== 4 · Como trabalhamos (azul): sequencia de passos, numeros em archivo ===== */}
        <section className="bg-phosphor px-4 py-20 text-paper md:px-6 md:py-28">
          <div className="border-b border-paper/25 pb-6">
            <span className="type-label text-paper/60">como trabalhamos · 5 passos</span>
            <Scramble as="h2" text="Do setor à medição no ar." className="type-title mt-3" />
          </div>
          <ol>
            {PASSOS.map((passo) => (
              <Reveal as="li" key={passo.num} className="grid grid-cols-[auto_1fr] items-start gap-6 border-b border-paper/25 py-8 md:grid-cols-[9rem_1fr] md:gap-10 md:py-10">
                <span className="font-display text-5xl leading-none text-paper/70 md:text-8xl">{passo.num}</span>
                <div className="pt-1">
                  <h3 className="font-display text-3xl leading-none md:text-5xl">{passo.nome}</h3>
                  <p className="mt-3 max-w-lg font-sans text-base leading-relaxed text-paper/80">{passo.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ===== 5 · No que a gente acredita (branco): imagem gigante + texto que EMPILHA (basement people) ===== */}
        <section className="bg-background px-4 pt-20 md:px-6 md:pt-28">
          <span className="type-label text-muted-foreground">no que a gente acredita</span>
          <div className="mt-8">
            {CRENCAS.map((c) => (
              <div
                key={c.titulo}
                className="sticky top-[var(--bar-h)] grid min-h-[calc(100svh-var(--bar-h))] items-center gap-8 border-t border-foreground/15 bg-background py-8 md:grid-cols-[1fr_1.1fr_0.9fr] md:gap-12"
              >
                <h3 className="font-display text-3xl leading-[0.95] md:text-5xl">{c.titulo}</h3>
                <div className="flex aspect-[4/3] items-center justify-center border border-foreground/15 bg-paper" data-cursor="3d">
                  <img src={c.img} alt="Ban, o mascote, em bitmap" className="h-4/5 w-4/5 object-contain grayscale contrast-[1.3]" style={{ imageRendering: "pixelated" }} />
                </div>
                <p className="font-sans text-lg leading-relaxed text-muted-foreground md:text-xl">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 6 · Fechamento (azul): janela IBM com quem trabalhamos + cta ===== */}
        <section className="bg-phosphor px-4 py-20 text-paper md:px-6 md:py-28">
          <div className="mx-auto max-w-4xl">
            <Window title="com-quem.txt" draggable={false} className="text-foreground" bodyClassName="!p-0">
              <div className="metastrip border-b border-foreground/15 px-4 py-2" aria-hidden>
                <span className="type-label text-muted-foreground">botellho</span>
                <span className="type-label text-phosphor">disponível para novos projetos</span>
                <span className="type-label text-muted-foreground">belo horizonte, br</span>
              </div>
              <div className="p-5 md:p-8">
                <span className="type-label text-muted-foreground">com quem trabalhamos</span>
                <ul className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
                  {COM_QUEM.map((quem) => (
                    <li key={quem} className="flex items-baseline gap-4 px-1 py-4 md:px-2">
                      <span className="text-phosphor">▪</span>
                      <span className="font-display text-2xl md:text-3xl">{quem}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 max-w-lg font-sans text-base leading-relaxed text-muted-foreground">
                  Se você trata o digital como parte da obra, e não como obrigação, a gente se entende.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/contato" className="cmd-button">Começar um projeto</Link>
                  <Link to="/trabalhos" className="cmd-button-ghost">Ver trabalhos</Link>
                </div>
              </div>
            </Window>
          </div>
        </section>
      </div>
    </>
  );
};

export default Studio;
