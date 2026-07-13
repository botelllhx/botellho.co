import { Head } from "vite-react-ssg";
import LineReveal from "@/motion/LineReveal";
import Typing from "@/motion/Typing";

// Logs: o lab e a saida continua do terminal do estudio.
const Lab = () => {
  return (
    <>
      <Head>
        <title>Lab | botellho</title>
        <meta
          name="description"
          content="O lab do botellho: experimentos de WebGL e dither, teardowns de sites institucionais e notas técnicas sobre web e experiências digitais."
        />
        <link rel="canonical" href="https://botellho.com/lab" />
        <meta property="og:title" content="Lab | botellho" />
        <meta
          property="og:description"
          content="Experimentos de WebGL e dither, teardowns e notas técnicas."
        />
        <meta property="og:url" content="https://botellho.com/lab" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      <section className="px-4 pt-16 md:px-6 md:pt-24">
        <Typing text="> tail -f lab.log" className="type-label text-muted-foreground" />
        <LineReveal as="h1" className="type-tese mt-8 max-w-4xl">
          O log público do estúdio.
        </LineReveal>
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
          Experimentos de shader e dither, teardowns de sites institucionais e
          notas técnicas. É aqui que a assinatura pensa em voz alta.
        </p>
      </section>

      <section className="mt-16 border-t border-foreground/10 px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-2xl space-y-2 font-mono text-sm text-muted-foreground">
          <p>
            <span className="text-phosphor">[aguardando]</span> primeira peça em produção
          </p>
          <p>
            <span className="text-phosphor">[aguardando]</span> teardown institucional em produção
          </p>
          <p className="type-dos pt-6 text-phosphor">&gt; volte em breve_</p>
        </div>
      </section>
    </>
  );
};

export default Lab;
