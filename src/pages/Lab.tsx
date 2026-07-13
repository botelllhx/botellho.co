import { Head } from "vite-react-ssg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Lab = () => {
  return (
    <>
      <Head>
        <title>Lab | botellho</title>
        <meta
          name="description"
          content="O lab do botellho: experimentos de WebGL e motion, teardowns de sites institucionais e notas técnicas sobre web e experiências digitais."
        />
        <link rel="canonical" href="https://botellho.com/lab" />
        <meta property="og:title" content="Lab | botellho" />
        <meta
          property="og:description"
          content="Experimentos de WebGL e motion, teardowns de sites institucionais e notas técnicas."
        />
        <meta property="og:url" content="https://botellho.com/lab" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      <div className="relative min-h-screen bg-background text-foreground">
        <Navbar />

        <main>
          <section className="container px-6 pt-40 pb-20 md:pt-48 md:pb-24">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              &gt; lab
            </span>
            <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,5.5vw,5rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              Experimentos, teardowns e{" "}
              <span className="text-primary">notas técnicas</span>.
            </h1>
            <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground">
              É aqui que a especialidade em WebGL e motion pensa em voz alta:
              experimentos de shader, teardowns de sites institucionais e notas
              sobre como construímos web que dura na memória.
            </p>
          </section>

          <section className="border-t border-foreground/10 py-24 md:py-32">
            <div className="container px-6">
              <p className="max-w-xl font-sans text-lg leading-relaxed text-muted-foreground">
                As primeiras peças estão em produção. Volte em breve.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Lab;
