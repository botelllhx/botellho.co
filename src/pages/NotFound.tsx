import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";

// 404 como tela de erro DOS (na linguagem do loader): fundo azul, IBM VGA,
// "404" gigante em bitmap, o Ban perdido e uma caixa de erro amigavel. Sem
// jargao que assuste; prompts de flavor, nunca comandos.
const NotFound = () => {
  return (
    <>
      <Head>
        <title>Erro 404 | botellho</title>
        <meta name="robots" content="noindex" />
      </Head>

      <section className="relative flex min-h-[calc(100svh-var(--bar-h))] flex-col justify-center overflow-hidden bg-phosphor px-4 py-14 text-paper md:px-6">
        <div className="boot__scanlines" />

        <div className="relative flex items-center justify-between border-b border-paper/25 pb-3 font-bitmap text-xs uppercase tracking-[0.18em] text-paper/60">
          <span>botellho microsystems</span>
          <span>erro fatal</span>
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-8 py-12">
          <div className="flex flex-wrap items-center gap-6 md:gap-12">
            <span className="font-bitmap leading-none text-[clamp(4.5rem,18vw,15rem)]">404</span>
            <img
              src="/ban/ban-1.png"
              alt="Ban, perdido"
              className="h-24 w-24 object-contain invert md:h-40 md:w-40"
              style={{ imageRendering: "pixelated" }}
              data-cursor="3d"
            />
          </div>

          <h1 className="font-display leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,6vw,5rem)]">rota não encontrada.</h1>

          <div className="max-w-xl border border-paper/30 p-5 font-mono text-sm leading-relaxed text-paper/85">
            <p>&gt; o endereço que você digitou não roda neste terminal.</p>
            <p>&gt; nenhum arquivo foi perdido.</p>
            <p>&gt; o ban também não sabe onde isso foi parar.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/" className="cmd-button !border-paper !bg-paper !text-phosphor">Voltar pra home</Link>
            <Link to="/trabalhos" className="cmd-button-ghost !border-paper/60 !text-paper">Ver trabalhos</Link>
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-paper/25 pt-3 font-bitmap text-[11px] uppercase tracking-[0.18em] text-paper/55">
          <span>seção · 404</span>
          <span className="caret">pressione voltar_</span>
        </div>
      </section>
    </>
  );
};

export default NotFound;
