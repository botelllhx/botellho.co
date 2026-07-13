import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import LineReveal from "@/motion/LineReveal";
import Decode from "@/motion/Decode";
import Typing from "@/motion/Typing";

// manifesto.txt: a pagina e um arquivo de texto aberto no terminal,
// com numeros de linha na margem e a tese em Geomini gigante.
const MANIFESTO: { id: string; text: string; serif?: boolean }[] = [
  {
    id: "10",
    text: "A maior parte do digital no Brasil é funcional e esquecível. A gente acredita no contrário: que um site pode ser tão bem construído quanto aquilo que ele apresenta.",
    serif: true,
  },
  {
    id: "20",
    text: "botellho é um estúdio de web e experiências digitais. Juntamos engenharia de verdade com direção de arte, do site institucional ao imersivo em 3D, sempre com a mesma régua de craft.",
  },
  {
    id: "30",
    text: "Entendemos o setor cultural por dentro: leis de incentivo, editais, prestação de contas. É um porquê confiar, não a definição do estúdio.",
  },
  {
    id: "40",
    text: "Trabalhamos com quem trata o digital como parte da obra, não como obrigação.",
  },
];

const MODOS = [
  {
    file: "modo_imersivo",
    invert: true,
    desc: "Quando a experiência é a mensagem: marca, festival, produto, lançamento. WebGL e 3D entram pesado, e o site vira a peça que as pessoas lembram.",
  },
  {
    file: "modo_institucional",
    invert: false,
    desc: "Quando o cliente precisa de clareza, acessibilidade e confiança: universidade, museu, fundação. O 3D entra como acento, a serviço do conteúdo.",
  },
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
        <link rel="canonical" href="https://botellho.com/studio" />
        <meta property="og:title" content="Estúdio | botellho" />
        <meta
          property="og:description"
          content="Estúdio de web e experiências digitais para marcas, cultura e instituições que querem ser lembradas."
        />
        <meta property="og:url" content="https://botellho.com/studio" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      <section className="px-4 pt-16 md:px-6 md:pt-24">
        <Typing text="> abrindo manifesto.txt" className="type-label text-muted-foreground" />
        <h1 className="type-tese mt-8 max-w-5xl">
          <LineReveal as="span" className="block">
            Web e experiências digitais
          </LineReveal>
          <span className="block">
            com <Decode text="craft de nível de prêmio" className="text-phosphor" delay={400} />.
          </span>
        </h1>
      </section>

      {/* O arquivo, com numeros de linha */}
      <section className="mt-20 border-t border-foreground/10 px-4 py-20 md:px-6 md:py-28">
        <div className="max-w-3xl space-y-10 md:ml-[20%]">
          {MANIFESTO.map((par) => (
            <div key={par.id} className="grid grid-cols-[3rem_1fr] gap-4">
              <span className="pt-1 font-mono text-xs text-muted-foreground">{par.id}</span>
              <p
                className={
                  par.serif
                    ? "font-serif text-xl leading-relaxed text-foreground md:text-2xl"
                    : "font-sans text-lg leading-relaxed text-muted-foreground"
                }
              >
                {par.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Modos de execucao */}
      <section className="border-t border-foreground/10 px-4 py-20 md:px-6 md:py-28">
        <span className="type-label text-muted-foreground">&gt; modos de execução</span>
        <LineReveal as="h2" className="type-title mt-6 max-w-3xl">
          Mesmo estúdio, dois modos.
        </LineReveal>

        <div className="mt-14 grid gap-0 md:grid-cols-2">
          {MODOS.map((modo) => (
            <div
              key={modo.file}
              className={
                modo.invert
                  ? "bg-foreground p-8 text-background md:p-12"
                  : "border border-foreground/15 p-8 md:p-12"
              }
            >
              <h3 className="font-mono text-lg font-bold md:text-2xl">
                {modo.file}
                <span className="text-phosphor">()</span>
              </h3>
              <p className="mt-4 max-w-md font-sans text-base leading-relaxed opacity-75">
                {modo.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Com quem trabalhamos */}
      <section className="border-t border-foreground/10 px-4 py-20 md:px-6 md:py-28">
        <span className="type-label text-muted-foreground">&gt; ls /com-quem-trabalhamos</span>
        <ul className="mt-10 max-w-3xl divide-y divide-foreground/10 border-y border-foreground/10">
          {PUBLICOS.map((publico) => (
            <li
              key={publico}
              className="dir-row px-2 py-4 font-mono text-sm md:px-4 md:text-base"
            >
              {publico}
            </li>
          ))}
        </ul>
      </section>

      {/* Chamada */}
      <section className="border-t border-foreground/10 px-4 py-20 md:px-6 md:py-28">
        <LineReveal as="h2" className="type-title max-w-3xl">
          O digital como parte da obra.
        </LineReveal>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/contact" className="cmd-button">
            Começar um projeto
          </Link>
          <Link to="/work" className="cmd-button-ghost">
            Ver trabalhos
          </Link>
        </div>
      </section>
    </>
  );
};

export default Studio;
