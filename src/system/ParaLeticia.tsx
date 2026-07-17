import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/motion/prefs";

// Easter egg: uma dedicatoria pra Leticia, escondida no site. Nao ha rota, nao ha
// link, nao entra no sitemap nem no HTML pre-renderizado. Ela so existe no DOM
// quando alguem a chama, e o jeito de chamar e um segredo:
//   - o atalho Ctrl/Cmd + Shift + L  (L de Leticia)
//   - digitar a palavra "leticia" em qualquer lugar (codigo secreto)
//   - abrir com #leticia no fim da URL (pra ele poder mandar o link pra ela)
// Esc fecha. Por nascer fechada e so no cliente, nunca pisca no carregamento e
// nunca e indexada.
const SENHA = "leticia";

const REGISTRO = [
  "toda vez que você diz que tem orgulho de mim, alguma coisa em mim se endireita",
  "nos dias difíceis, eu releio as suas palavras antes de continuar",
  "você acredita em mim um pouco antes de eu acreditar, e isso muda tudo",
];

const ParaLeticia = () => {
  const [aberta, setAberta] = useState(false);
  const buffer = useRef("");
  const fechar = useCallback(() => {
    setAberta(false);
    if (typeof window !== "undefined" && window.location.hash === "#leticia") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const abrir = () => setAberta(true);

    const onKey = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      const digitando = alvo && /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName);

      if (aberta && e.key === "Escape") {
        fechar();
        return;
      }
      // o atalho: Ctrl/Cmd + Shift + L
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        abrir();
        return;
      }
      // o codigo secreto: a palavra "leticia" digitada fora de um campo
      if (!digitando && !e.metaKey && !e.ctrlKey && e.key.length === 1) {
        buffer.current = (buffer.current + e.key.toLowerCase()).slice(-SENHA.length);
        if (buffer.current === SENHA) {
          buffer.current = "";
          abrir();
        }
      }
    };

    const onHash = () => {
      if (window.location.hash === "#leticia") setAberta(true);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    onHash(); // se a pessoa chegou direto pelo link
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [aberta, fechar]);

  // trava o scroll do site atras enquanto a dedicatoria esta aberta
  useEffect(() => {
    if (!aberta) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = antes;
    };
  }, [aberta]);

  if (!aberta) return null;

  const semMovimento = prefersReducedMotion();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Uma dedicatória para a Letícia"
      className="fixed inset-0 z-[120] overflow-y-auto bg-[#07070c] font-mono text-paper"
    >
      <div className="boot__scanlines" />

      <div className="relative mx-auto flex min-h-full max-w-2xl flex-col px-4 py-6 md:px-6">
        {/* rail de topo, igual boot/404 */}
        <div className="flex items-center justify-between border-b border-paper/20 pb-3 text-[11px] uppercase tracking-[0.18em] text-paper/55">
          <span>botellho microsystems</span>
          <span>para_leticia.exe</span>
        </div>

        {/* card de perfil, preenchido de azul, igual a referencia */}
        <div className="mt-6 flex flex-col gap-5 bg-phosphor p-5 text-paper sm:flex-row sm:gap-6 sm:p-6">
          <img
            src="/leticia/leticia.png"
            alt="Letícia, sorrindo, em dither"
            width={224}
            height={302}
            className="mx-auto h-40 w-auto shrink-0 sm:mx-0 sm:h-48"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="type-dos text-xl md:text-2xl">@leticia</span>
              <span className={semMovimento ? "text-paper" : "coracao text-paper"} aria-hidden>
                ♡
              </span>
            </div>
            <p className="mt-1 text-sm text-paper/80">a pessoa que tem orgulho de mim</p>

            <p className="mt-4 font-sans text-[15px] leading-relaxed text-paper/90">
              Este canto do site não está no mapa. Ninguém chega aqui por acaso.
              Ele só abre pra quem sabe apertar o <strong className="text-paper">L</strong>, de Letícia.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-paper/85">
              <span className="border border-paper/40 px-2 py-1">∞ motivos</span>
              <span className="border border-paper/40 px-2 py-1">1 Letícia</span>
              <span className="border border-paper/40 px-2 py-1">todo o orgulho</span>
            </div>
          </div>
        </div>

        {/* a dedicatoria: o "post fixado" */}
        <div className="mt-4 border border-phosphor/45 p-5 md:p-6">
          <div className="flex items-center justify-between border-b border-phosphor/25 pb-3 text-[11px] uppercase tracking-[0.16em] text-phosphor">
            <span>&gt; para_leticia.txt</span>
            <span className="text-paper/40">fixado</span>
          </div>

          <div className="mt-5 space-y-4 font-sans text-[15px] leading-relaxed text-paper/90">
            <p>Letícia,</p>
            <p>
              Tem uma coisa que você faz sem medir o tamanho. Você diz que tem
              orgulho de mim. E cada vez que você diz, o dia inteiro fica mais leve
              de carregar.
            </p>
            <p>
              Eu construí este esconderijo pra guardar um obrigado que não cabia
              numa mensagem: obrigado por todas as suas palavras que demonstram
              orgulho de mim. Elas me sustentam justo nos dias em que eu esqueço de
              ter orgulho de mim mesmo.
            </p>
          </div>

          {/* registro: reaproveita o "changelog" da referencia como carinho */}
          <ul className="mt-6 space-y-2 border-t border-phosphor/25 pt-5 text-sm text-paper/80">
            {REGISTRO.map((linha) => (
              <li key={linha} className="flex gap-2">
                <span className="text-phosphor" aria-hidden>
                  •
                </span>
                <span>{linha}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 font-serif text-lg italic text-paper">
            Você é a melhor coisa que eu não precisei aprender a construir.
          </p>
          <p className="mt-3 text-sm text-paper/70">
            te amo <span className={semMovimento ? "" : "caret"} />
          </p>
        </div>

        {/* rail de baixo, com os atalhos, igual a referencia */}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-paper/20 pt-4 pb-2 text-[11px] uppercase tracking-[0.16em] text-paper/55">
          <span>
            <span className="text-phosphor">[ESC]</span> fechar
          </span>
          <span className="hidden sm:block">L de Letícia</span>
          <button
            type="button"
            onClick={fechar}
            className="border border-paper/40 px-3 py-1 uppercase tracking-[0.16em] text-paper/80 transition-colors hover:bg-paper hover:text-[#07070c]"
          >
            fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParaLeticia;
