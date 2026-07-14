import { Head } from "vite-react-ssg";
import { Link, useLocation } from "react-router-dom";

// 404 na mesma lingua do loader: tela azul DOS, IBM VGA no tudo, log com
// leaders pontilhados, uma barra de blocos que falha no meio, rails de
// cabecalho/status e o Ban perdido. Prompts de flavor, nunca comandos.
const NotFound = () => {
  const { pathname } = useLocation();
  const rota = pathname.length > 28 ? `${pathname.slice(0, 27)}…` : pathname;

  const DIAG = [
    { l: "rota solicitada", v: rota },
    { l: "status", v: "404 não encontrada" },
    { l: "arquivos perdidos", v: "nenhum" },
    { l: "ban localizado", v: "não" },
  ];

  return (
    <>
      <Head>
        <title>Erro 404 | botellho</title>
        <meta name="robots" content="noindex" />
      </Head>

      <section className="font-bitmap relative flex min-h-[calc(100svh-var(--bar-h))] flex-col justify-center overflow-hidden bg-phosphor px-4 py-12 text-paper md:px-6">
        <div className="boot__scanlines" />

        <div className="relative flex items-center justify-between border-b border-paper/25 pb-3 text-xs uppercase tracking-[0.18em] text-paper/60">
          <span>botellho microsystems</span>
          <span>erro 404</span>
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-8 py-10">
          <div className="flex flex-wrap items-center gap-6 md:gap-12">
            <span className="leading-none text-[clamp(4.5rem,17vw,14rem)]">404</span>
            <img
              src="/ban/ban-1.png"
              alt="Ban, perdido"
              className="h-24 w-24 object-contain invert md:h-36 md:w-36"
              style={{ imageRendering: "pixelated" }}
              data-cursor="3d"
            />
          </div>

          <p className="leading-[1.05] text-[clamp(1.5rem,4.5vw,3rem)]">sinal perdido — rota não encontrada.</p>

          {/* diagnostico com leaders, igual o log do loader */}
          <div className="max-w-xl space-y-1.5 border-t border-paper/25 pt-6 text-sm">
            {DIAG.map((d) => (
              <div key={d.l} className="flex items-baseline gap-2">
                <span className="text-paper/85">{d.l}</span>
                <span className="mb-1 flex-1 border-b border-dotted border-paper/30" />
                <span className="truncate text-paper">{d.v}</span>
              </div>
            ))}
            {/* barra de blocos que falha no meio */}
            <div className="pt-3">
              <div className="flex items-center justify-between">
                <span>carregando rota</span>
                <span className="text-paper/70">falhou</span>
              </div>
              <div className="mt-2 tracking-[0.15em]" aria-hidden>{"█".repeat(9)}{"·".repeat(15)}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 font-mono">
            <Link to="/" className="cmd-button !border-paper !bg-paper !text-phosphor">Voltar pra home</Link>
            <Link to="/trabalhos" className="cmd-button-ghost !border-paper/60 !text-paper">Ver trabalhos</Link>
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-paper/25 pt-3 text-[11px] uppercase tracking-[0.18em] text-paper/55">
          <span>seção · 404</span>
          <span className="caret">pressione voltar_</span>
        </div>
      </section>
    </>
  );
};

export default NotFound;
