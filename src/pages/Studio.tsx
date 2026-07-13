import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import LineReveal from "@/motion/LineReveal";
import SignalText from "@/motion/SignalText";
import Typing from "@/motion/Typing";
import SystemDivider from "@/system/SystemDivider";

const MANIFESTO = [
  { id: "10", text: "A maior parte do digital no Brasil é funcional e esquecível. A gente acredita no contrário: que um site pode ser tão bem construído quanto aquilo que ele apresenta.", serif: true },
  { id: "20", text: "botellho é um estúdio de web e experiências digitais. Juntamos engenharia de verdade com direção de arte, do site institucional ao imersivo em 3D, sempre com a mesma régua de craft." },
  { id: "30", text: "Entendemos o setor cultural por dentro: leis de incentivo, editais, prestação de contas. É um porquê confiar, não a definição do estúdio." },
  { id: "40", text: "Trabalhamos com quem trata o digital como parte da obra, não como obrigação." },
];

const PASSOS = [
  { num: "01", nome: "imersão", desc: "Entender o setor, o público e a obra antes de desenhar qualquer tela." },
  { num: "02", nome: "conceito", desc: "A ideia que organiza tudo, a tese que o projeto vai defender." },
  { num: "03", nome: "arte + engenharia", desc: "Direção de arte e construção andando juntas, nunca em sequência." },
  { num: "04", nome: "craft", desc: "O detalhe do qual a gente se orgulha: o shader, a transição, o sistema." },
  { num: "05", nome: "no ar", desc: "Entrega medindo o que importa: performance, acessibilidade, memória." },
];

const PUBLICOS = [
  "marcas-que-tratam-o-digital-como-experiencia",
  "festivais-eventos-e-lancamentos",
  "museus-e-centros-culturais",
  "fundacoes-institutos-e-universidades",
  "produto-digital",
  "estudios-e-designers (white-label)",
];

const Studio = () => {
  return (
    <>
      <Head>
        <title>Estúdio | botellho</title>
        <meta
          name="description"
          content="botellho é um estúdio de web e experiências digitais. Engenharia, direção de arte e entendimento do setor cultural por dentro, do site institucional ao imersivo em 3D."
        />
        <link rel="canonical" href="https://botellho.com/estudio" />
        <meta property="og:title" content="Estúdio | botellho" />
        <meta property="og:description" content="Estúdio de web e experiências digitais para marcas, cultura e instituições que querem ser lembradas." />
        <meta property="og:url" content="https://botellho.com/estudio" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      {/* ===== A · Abertura (paper) ===== */}
      <section className="px-4 pt-16 md:px-6 md:pt-24">
        <Typing text="> abrindo estudio" className="type-label text-muted-foreground" />
        <h1 className="type-tese mt-8 max-w-5xl">
          <LineReveal as="span" className="block">Web e experiências digitais</LineReveal>
          <span className="block">com <SignalText text="craft de nível de prêmio" className="text-phosphor" delay={400} />.</span>
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground">
          botellho é um estúdio de web e experiências digitais para marcas,
          cultura e instituições que querem ser lembradas.
        </p>
      </section>

      <SystemDivider text="manifesto" />

      {/* ===== C · Manifesto (ink, editorial com numeros de linha) ===== */}
      <section className="dark bg-background px-4 py-20 text-foreground md:px-6 md:py-28">
        <span className="type-label text-muted-foreground">&gt; manifesto.txt</span>
        <div className="mt-10 max-w-3xl space-y-10 md:ml-[18%]">
          {MANIFESTO.map((par) => (
            <div key={par.id} className="grid grid-cols-[3rem_1fr] gap-4">
              <span className="pt-1 font-mono text-xs text-phosphor">{par.id}</span>
              <p className={par.serif ? "font-serif text-xl leading-relaxed text-foreground md:text-2xl" : "font-sans text-lg leading-relaxed text-foreground/75"}>
                {par.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SystemDivider text="como trabalhamos" ban />

      {/* ===== B · Como trabalhamos (paper, split-scroll) ===== */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <span className="type-label text-muted-foreground">&gt; processo</span>
            <LineReveal as="h2" className="type-title mt-6">Como trabalhamos.</LineReveal>
            <p className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
              Cinco passos, do entendimento do setor à medição no ar.
            </p>
          </div>
          <ol className="border-t border-foreground/15">
            {PASSOS.map((passo) => (
              <li key={passo.num} className="dir-row grid grid-cols-[2.5rem_1fr] gap-4 border-b border-foreground/15 px-2 py-8 md:px-4">
                <span className="font-mono text-xs text-phosphor">{passo.num}</span>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl">{passo.nome}</h3>
                  <p className="mt-2 max-w-md font-sans text-sm leading-relaxed opacity-70">{passo.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SystemDivider text="com quem" />

      {/* ===== D · Com quem / prova (ink, bloco de terminal) ===== */}
      <section className="dark bg-background px-4 py-20 text-foreground md:px-6 md:py-28">
        <div className="max-w-4xl border border-foreground/20">
          <div className="flex items-center justify-between border-b border-foreground/20 px-4 py-2">
            <span className="type-dos text-xs text-phosphor">com-quem.log</span>
            <span className="type-label text-muted-foreground">local · foco · disponível</span>
          </div>
          <div className="p-5 md:p-8">
            <p className="type-dos mb-6 text-sm text-phosphor">&gt; ls /com-quem-trabalhamos</p>
            <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
              {PUBLICOS.map((publico) => (
                <li key={publico} className="dir-row px-2 py-4 font-mono text-sm md:px-4 md:text-base">{publico}</li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/contato" className="cmd-button">Começar um projeto</Link>
              <Link to="/trabalhos" className="cmd-button-ghost">Ver trabalhos</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Studio;
