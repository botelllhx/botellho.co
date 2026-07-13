import { Head } from "vite-react-ssg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const modos = [
  {
    title: "Modo imersivo",
    description:
      "Quando a experiência é a mensagem: marca, festival, produto, lançamento. WebGL e 3D entram pesado, e o site vira a peça que as pessoas lembram.",
  },
  {
    title: "Modo institucional",
    description:
      "Quando o cliente precisa de clareza, acessibilidade e confiança: universidade, museu, fundação. O 3D entra como acento pontual, a serviço do conteúdo.",
  },
];

const publicos = [
  "Museus e centros culturais",
  "Fundações e institutos",
  "Festivais e exposições",
  "Universidades e órgãos",
  "Marcas que tratam o digital como experiência",
  "Estúdios e designers (white-label)",
];

const Studio = () => {
  return (
    <>
      <Head>
        <title>Estúdio | botellho</title>
        <meta
          name="description"
          content="botellho é um estúdio de web e experiências digitais para instituições culturais e marcas. Engenharia, direção de arte e domínio do setor cultural, do institucional ao imersivo."
        />
        <link rel="canonical" href="https://botellho.com/studio" />
        <meta property="og:title" content="Estúdio | botellho" />
        <meta
          property="og:description"
          content="Estúdio de web e experiências digitais para instituições culturais e marcas que querem ser lembradas."
        />
        <meta property="og:url" content="https://botellho.com/studio" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
        <meta name="twitter:title" content="Estúdio | botellho" />
        <meta
          name="twitter:description"
          content="Estúdio de web e experiências digitais para instituições culturais e marcas que querem ser lembradas."
        />
        <meta name="twitter:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      <div className="relative min-h-screen bg-background text-foreground">
        <Navbar />

        <main>
          {/* Intro */}
          <section className="container px-6 pt-40 pb-24 md:pt-48 md:pb-32">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              (O estúdio)
            </span>
            <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,5.5vw,5rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              Craft de nível de prêmio,{" "}
              <span className="text-primary">domínio real do setor cultural</span>.
            </h1>
            <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground">
              botellho é um estúdio de web e experiências digitais para
              instituições culturais e marcas que querem ser lembradas.
            </p>
          </section>

          {/* Manifesto */}
          <section className="border-t border-foreground/10 py-24 md:py-32">
            <div className="container grid gap-12 px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Manifesto
              </span>
              <div className="max-w-2xl space-y-6">
                <p className="font-sans text-xl leading-relaxed text-foreground">
                  A maior parte do digital institucional no Brasil é funcional e
                  esquecível. A gente acredita no contrário: que uma instituição
                  merece um site tão bem construído quanto o acervo que ela guarda.
                </p>
                <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                  Juntamos três coisas que raramente andam juntas: engenharia de
                  verdade, direção de arte, e entendimento de como o setor cultural
                  funciona por dentro. Fazemos do site institucional ao imersivo em
                  3D, sempre com a mesma régua de craft.
                </p>
                <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                  Trabalhamos com quem trata o digital como parte da obra, não como
                  obrigação.
                </p>
              </div>
            </div>
          </section>

          {/* Dois modos */}
          <section className="border-t border-foreground/10 py-24 md:py-32">
            <div className="container px-6">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Como trabalhamos
              </span>
              <h2 className="mt-6 max-w-3xl font-display text-large font-bold">
                Mesmo estúdio, dois modos.
              </h2>
              <div className="mt-16 grid gap-0 md:grid-cols-2">
                {modos.map((modo) => (
                  <div
                    key={modo.title}
                    className="border-t border-foreground/10 py-12 md:border-l md:border-t-0 md:px-12 md:first:border-l-0 md:first:pl-0"
                  >
                    <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                      {modo.title}
                    </h3>
                    <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-muted-foreground">
                      {modo.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Com quem trabalhamos */}
          <section className="border-t border-foreground/10 py-24 md:py-32">
            <div className="container grid gap-12 px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Com quem trabalhamos
              </span>
              <ul className="max-w-2xl divide-y divide-foreground/10 border-y border-foreground/10">
                {publicos.map((publico) => (
                  <li
                    key={publico}
                    className="py-5 font-display text-xl font-bold text-foreground md:text-2xl"
                  >
                    {publico}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-foreground/10 py-24 md:py-32">
            <div className="container flex flex-col items-start gap-8 px-6 md:flex-row md:items-center md:justify-between">
              <h2 className="max-w-2xl font-display text-large font-bold">
                Tem um projeto que merece ser lembrado?
              </h2>
              <div className="flex flex-wrap gap-4">
                <a href="/#contato" className="neo-button">
                  Começar um projeto
                </a>
                <a href="/#portfolio" className="neo-button-outline">
                  Ver trabalhos
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Studio;
