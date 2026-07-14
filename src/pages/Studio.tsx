import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import Scramble from "@/motion/Scramble";
import Reveal from "@/motion/Reveal";
import Typing from "@/motion/Typing";
import Window from "@/system/Window";

const PASSOS = [
  { num: "01", nome: "imersão", desc: "Entender o setor, o público e o objetivo antes de desenhar qualquer tela." },
  { num: "02", nome: "conceito", desc: "A ideia que organiza tudo: a tese que o projeto vai defender." },
  { num: "03", nome: "arte + engenharia", desc: "Direção de arte e construção andando juntas, nunca em sequência." },
  { num: "04", nome: "craft", desc: "O detalhe do qual a gente se orgulha: o shader, a transição, o sistema." },
  { num: "05", nome: "no ar", desc: "Entrega medindo o que importa: performance, acessibilidade e SEO." },
];

const VALORES = [
  "engenharia e arte na mesma mesa",
  "o detalhe é o produto",
  "web aberta, rápida e acessível",
  "no prazo combinado, sem drama",
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

      {/* ===== 1 · Abertura (branco): identidade + janela com o Ban ===== */}
      <section className="bg-background px-4 pt-10 md:px-6">
        <div className="grid items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Typing text="> estúdio" className="type-label text-muted-foreground" />
            <h1 className="type-tese mt-6">
              <Scramble as="span" text="estúdio de" className="block" onMount />
              <Scramble as="span" text="web & experiências" className="block font-bitmap" onMount delay={160} />
            </h1>
            <p className="mt-8 max-w-md font-sans text-lg leading-relaxed text-muted-foreground">
              botellho junta engenharia de verdade com direção de arte, do site
              institucional ao imersivo em 3D, sempre com a mesma régua de craft.
              Para marcas, cultura e instituições que querem ser lembradas.
            </p>
          </div>

          <Window title="ban.bmp" phosphor bodyClassName="!p-0">
            <div className="relative flex aspect-[4/3] items-center justify-center bg-paper" data-cursor="3d">
              <img src="/ban/ban-3.png" alt="Ban, o mascote, em bitmap" className="h-4/5 w-4/5 object-contain" style={{ imageRendering: "pixelated" }} />
              <span className="crt-frame__tag type-label !text-foreground/60">ban // bitmap</span>
            </div>
          </Window>
        </div>
      </section>

      {/* ===== 2 · Manifesto / filosofia (azul): declaracao gigante full-bleed ===== */}
      <section className="flex min-h-screen flex-col justify-center bg-phosphor px-4 py-24 text-paper md:px-6">
        <div className="flex items-center justify-between border-b border-paper/25 pb-4 font-mono text-[11px] uppercase tracking-widest text-paper/55">
          <span>manifesto</span>
          <span className="normal-case tracking-normal">/estudio/manifesto.txt</span>
        </div>

        <div className="flex flex-1 items-center py-14">
          <div className="max-w-6xl">
            <Scramble as="p" text="Um site pode ser tão bem construído quanto aquilo que apresenta." className="block font-display leading-[0.92] tracking-[-0.02em] text-[clamp(2.5rem,7vw,8rem)]" duration={1100} />
            <p className="mt-10 font-bitmap leading-[1.05] text-[clamp(1.5rem,4vw,3.5rem)] text-paper/90">craft não é enfeite.</p>
          </div>
        </div>

        <p className="max-w-xl border-t border-paper/25 pt-6 font-sans text-lg leading-relaxed text-paper/80 md:text-xl">
          É o que separa o memorável do esquecível. E é a única régua que a gente
          aplica igual, do institucional ao experimental.
        </p>
      </section>

      {/* ===== 3 · Como trabalhamos (branco): processo em 5 passos ===== */}
      <section className="bg-background px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <span className="type-label text-muted-foreground">como trabalhamos</span>
            <Scramble as="h2" text="Do setor à medição no ar." className="type-title mt-5" />
            <p className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
              Cinco passos, sem etapa pulada. Arte e engenharia caminham juntas o tempo todo.
            </p>
          </div>
          <ol className="border-t border-foreground/15">
            {PASSOS.map((passo) => (
              <Reveal as="li" key={passo.num} className="grid grid-cols-[auto_1fr] items-baseline gap-5 border-b border-foreground/15 py-7 md:gap-8">
                <span className="font-bitmap text-4xl leading-none text-phosphor md:text-6xl">{passo.num}</span>
                <div>
                  <h3 className="font-display text-2xl md:text-4xl">{passo.nome}</h3>
                  <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">{passo.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== 4 · No que a gente acredita + fechamento (azul) ===== */}
      <section className="bg-phosphor px-4 py-20 text-paper md:px-6 md:py-28">
        <span className="type-label text-paper/60">no que a gente acredita</span>
        <ul className="mt-8 border-t border-paper/25">
          {VALORES.map((v, i) => (
            <li key={v} className="flex items-baseline gap-4 border-b border-paper/25 py-6">
              <span className="font-mono text-xs text-paper/60">{String(i + 1).padStart(2, "0")}</span>
              <Scramble as="span" text={v} className="font-display text-3xl leading-none md:text-5xl" />
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-lg font-sans text-lg leading-relaxed text-paper/80 md:text-xl">
            Se você trata o digital como parte da obra, e não como obrigação, a gente se entende.
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link to="/contato" className="cmd-button !border-paper !bg-paper !text-phosphor">Começar um projeto</Link>
            <Link to="/trabalhos" className="cmd-button-ghost !border-paper/60 !text-paper">Ver trabalhos</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Studio;
