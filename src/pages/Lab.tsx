import { Head } from "vite-react-ssg";
import Scramble from "@/motion/Scramble";
import Typing from "@/motion/Typing";
import Window from "@/system/Window";

const LOGS = [
  { data: "em breve", tipo: "experimento", titulo: "dither em tempo real com bayer 4x4" },
  { data: "em breve", tipo: "teardown", titulo: "como eu refaria o site de um museu" },
  { data: "em breve", tipo: "escrito", titulo: "quantização de paleta em webgl" },
];

// /laboratorio: a saida continua do estudio, enquadrada como um log.
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

      <section className="bg-background px-4 pb-16 pt-16 md:px-6 md:pb-24 md:pt-24">
        <Typing text="> laboratório" className="type-label text-muted-foreground" />
        <Scramble as="h1" text="O log público do estúdio." className="mt-8 block font-display leading-[0.9] tracking-[-0.03em] text-[clamp(2.5rem,8.5vw,9rem)]" />
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
          Experimentos de shader e dither, teardowns de sites institucionais e
          notas técnicas. É aqui que a assinatura pensa em voz alta.
        </p>
      </section>

      <section className="bg-phosphor px-4 py-16 text-paper md:px-6 md:py-24">
        <Window title="lab.log" draggable={false} className="mx-auto max-w-4xl text-foreground" bodyClassName="!p-0">
          <div className="metastrip border-b border-foreground/15 px-4 py-2" aria-hidden>
            <span className="type-label text-muted-foreground">aguardando primeira peça</span>
            <span className="type-label text-phosphor">em construção</span>
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
        </Window>
        <p className="caret mt-8 text-center font-mono text-sm text-paper/70">&gt; volte em breve_</p>
      </section>
    </>
  );
};

export default Lab;
