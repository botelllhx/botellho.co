import { Head } from "vite-react-ssg";
import LineReveal from "@/motion/LineReveal";
import Typing from "@/motion/Typing";

const LOGS = [
  { data: "em breve", tipo: "experimento", titulo: "dither em tempo real com bayer 4x4" },
  { data: "em breve", tipo: "teardown", titulo: "como eu refaria o site de um museu" },
  { data: "em breve", tipo: "escrito", titulo: "quantização de paleta em webgl" },
];

// /laboratorio (arquetipo B/terminal): a saida continua do estudio.
const Lab = () => {
  return (
    <>
      <Head>
        <title>Lab | botellho</title>
        <meta
          name="description"
          content="O lab do botellho: experimentos de WebGL e dither, teardowns de sites institucionais e notas técnicas sobre web e experiências digitais."
        />
        <link rel="canonical" href="https://botellho.com/laboratorio" />
        <meta property="og:title" content="Lab | botellho" />
        <meta property="og:description" content="Experimentos de WebGL e dither, teardowns e notas técnicas." />
        <meta property="og:url" content="https://botellho.com/laboratorio" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      <section className="px-4 pt-16 md:px-6 md:pt-24">
        <Typing text="> tail -f lab.log" className="type-label text-muted-foreground" />
        <LineReveal as="h1" className="type-tese mt-8 max-w-4xl">O log público do estúdio.</LineReveal>
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
          Experimentos de shader e dither, teardowns de sites institucionais e
          notas técnicas. É aqui que a assinatura pensa em voz alta.
        </p>
      </section>

      {/* Índice em log (ink), hover com scanline */}
      <section className="dark bg-background mt-14 px-4 py-16 text-foreground md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl border border-foreground/20">
          <div className="flex items-center justify-between border-b border-foreground/20 px-4 py-2">
            <span className="type-dos text-xs text-phosphor">lab.log</span>
            <span className="type-label text-muted-foreground">aguardando primeira peça</span>
          </div>
          <ul>
            {LOGS.map((log, i) => (
              <li key={i} className="lab-row grid grid-cols-[7rem_1fr] items-baseline gap-3 border-b border-foreground/10 px-4 py-4 font-mono text-sm last:border-0 md:grid-cols-[8rem_9rem_1fr]">
                <span className="text-phosphor">[{log.data}]</span>
                <span className="hidden text-muted-foreground md:block">{log.tipo}</span>
                <span className="text-foreground/80">{log.titulo}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="type-dos mt-8 text-center text-phosphor">&gt; volte em breve_</p>
      </section>
    </>
  );
};

export default Lab;
