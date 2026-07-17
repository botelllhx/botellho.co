import { useEffect } from "react";
import { Head } from "vite-react-ssg";
import { Link, useLocation, useRouteError } from "react-router-dom";

// Rede de segurança das rotas. Sem isto, qualquer falha (um chunk lazy que nao
// chega, um loader que explode) faz o React Router trocar a pagina pela tela crua
// "Unexpected Application Error!" em Times New Roman. Foi o que o Google rastreou
// e marcou como soft 404: o HTML do SSG estava perfeito, quem destruia a pagina
// era a hidratacao.
//
// Mesma lingua do 404 e do boot: tela azul DOS, log com leaders, barra que falha.

const CHAVE = "botellho:recarga-por-chunk";

// Chunk que nao chega tem varias causas (rede instavel, bloqueador, firewall,
// soluco de CDN) e uma bem comum: deploy novo, o arquivo velho sumiu do servidor
// e a aba aberta ainda pede o nome antigo. Nesse caso recarregar RESOLVE.
const ehErroDeChunk = (erro: unknown) =>
  erro instanceof Error &&
  /dynamically imported module|Importing a module script failed|error loading dynamically|Failed to fetch/i.test(
    erro.message,
  );

const leu = () => {
  try {
    return !!sessionStorage.getItem(CHAVE);
  } catch {
    return true; // storage bloqueado: nao insiste, vai direto pra tela
  }
};

const ErroDeRota = () => {
  const erro = useRouteError();
  const { pathname } = useLocation();

  // Calculado no render (leitura pura) pra nao piscar a tela de erro antes de
  // recarregar. A escrita fica no efeito. Uma tentativa so: a chave no
  // sessionStorage e o que impede o loop, porque ela sobrevive ao reload.
  const vaiTentarDeNovo = typeof window !== "undefined" && ehErroDeChunk(erro) && !leu();

  useEffect(() => {
    if (!vaiTentarDeNovo) return;
    try {
      sessionStorage.setItem(CHAVE, "1");
    } catch {
      return;
    }
    window.location.reload();
  }, [vaiTentarDeNovo]);

  if (vaiTentarDeNovo) return null;

  const rota = pathname.length > 28 ? `${pathname.slice(0, 27)}…` : pathname;
  const DIAG = [
    { l: "rota solicitada", v: rota },
    { l: "status", v: "falha ao carregar" },
    { l: "conteúdo", v: "intacto no servidor" },
    { l: "nova tentativa", v: "já feita" },
  ];

  return (
    <>
      <Head>
        <title>Falha ao carregar | botellho</title>
        <meta name="robots" content="noindex" />
      </Head>

      <section className="font-bitmap relative flex min-h-[calc(100svh-var(--bar-h))] flex-col justify-center overflow-hidden bg-phosphor px-4 py-12 text-paper md:px-6">
        <div className="boot__scanlines" />

        <div className="relative flex items-center justify-between border-b border-paper/25 pb-3 text-xs uppercase tracking-[0.18em] text-paper/60">
          <span>botellho microsystems</span>
          <span>falha de carga</span>
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-8 py-10">
          <div className="flex flex-wrap items-center gap-6 md:gap-12">
            <span className="leading-none text-[clamp(3rem,11vw,9rem)]">erro</span>
            <img
              src="/ban/ban-1.png"
              alt="Ban, esperando"
              className="h-24 w-24 object-contain invert md:h-36 md:w-36"
              style={{ imageRendering: "pixelated" }}
              data-cursor="3d"
            />
          </div>

          <p className="leading-[1.05] text-[clamp(1.5rem,4.5vw,3rem)]">
            um pedaço do site não chegou.
          </p>
          <p className="max-w-xl font-mono text-sm text-paper/75">
            Não é você: a página existe e está inteira no servidor. Alguma coisa no caminho
            (rede, bloqueador ou uma versão antiga em cache) impediu o carregamento.
          </p>

          <div className="max-w-xl space-y-1.5 border-t border-paper/25 pt-6 text-sm">
            {DIAG.map((d) => (
              <div key={d.l} className="flex items-baseline gap-2">
                <span className="text-paper/85">{d.l}</span>
                <span className="mb-1 flex-1 border-b border-dotted border-paper/30" />
                <span className="truncate text-paper">{d.v}</span>
              </div>
            ))}
            <div className="pt-3">
              <div className="flex items-center justify-between">
                <span>carregando módulo</span>
                <span className="text-paper/70">falhou</span>
              </div>
              <div className="mt-2 tracking-[0.15em]" aria-hidden>
                {"█".repeat(14)}
                {"·".repeat(10)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 font-mono">
            <button
              type="button"
              onClick={() => {
                try {
                  sessionStorage.removeItem(CHAVE);
                } catch {
                  /* storage bloqueado: recarrega mesmo assim */
                }
                window.location.reload();
              }}
              className="cmd-button !border-paper !bg-paper !text-phosphor"
            >
              Tentar de novo
            </button>
            <Link to="/" className="cmd-button-ghost !border-paper/60 !text-paper">
              Voltar pra home
            </Link>
            <a
              href="mailto:contato@botellho.com"
              className="cmd-button-ghost !border-paper/60 !text-paper"
            >
              Falar com a gente
            </a>
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-paper/25 pt-3 text-[11px] uppercase tracking-[0.18em] text-paper/55">
          <span>seção · erro</span>
          <span className="caret">pressione tentar_</span>
        </div>
      </section>
    </>
  );
};

export default ErroDeRota;
