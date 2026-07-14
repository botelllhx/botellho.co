import { useState } from "react";

// Lista gigante centralizada a la Locomotive (carreiras): numeracao e linhas
// divisorias na estetica DOS, e no hover um gif engracado abre INLINE no meio da
// frase (tipo "Project [gif] Manager"). Gifs sao pesados, entao so carregam
// depois do primeiro hover (lazy).
const ITENS = [
  { esq: "sem lorem", dir: "ipsum", gif: "/gifs/lorem.gif" },
  { esq: "sem tema", dir: "de prateleira", gif: "/gifs/tema.gif" },
  { esq: "sem powerpoint", dir: "infinito", gif: "/gifs/powerpoint.gif" },
  { esq: "reunião que", dir: "era e-mail", gif: "/gifs/reuniao.gif" },
  { esq: "sem site", dir: "travado", gif: "/gifs/travado.gif" },
  { esq: "sem preguiça", dir: "de detalhe", gif: "/gifs/preguica.gif" },
];

const GifList = () => {
  const [hover, setHover] = useState<number | null>(null);
  const [ativos, setAtivos] = useState<Set<number>>(new Set());

  const entrar = (i: number) => {
    setHover(i);
    setAtivos((s) => (s.has(i) ? s : new Set(s).add(i)));
  };

  return (
    <section className="bg-phosphor px-4 py-20 text-paper md:px-6 md:py-28">
      <div className="flex items-center justify-between border-b border-paper/25 pb-4 font-mono text-[11px] uppercase tracking-widest text-paper/55">
        <span>regras da casa</span>
        <span className="normal-case tracking-normal">({ITENS.length})</span>
      </div>

      <ul>
        {ITENS.map((item, i) => (
          <li
            key={item.esq}
            onMouseEnter={() => entrar(i)}
            onMouseLeave={() => setHover(null)}
            className={`group border-b border-paper/25 transition-opacity duration-300 ${hover !== null && hover !== i ? "opacity-30" : "opacity-100"}`}
          >
            <div className="flex items-center gap-4 py-5 md:py-7">
              <span className="w-8 shrink-0 font-mono text-xs text-paper/60 md:w-12 md:text-sm">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="flex flex-1 flex-wrap items-center justify-center text-center font-display uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(1.75rem,6vw,6rem)]">
                <span>{item.esq}</span>
                <span className="mx-2 inline-flex h-[1em] w-0 items-center justify-center overflow-hidden transition-[width] duration-300 ease-out group-hover:w-[1.6em] md:mx-3">
                  {ativos.has(i) ? (
                    <img src={item.gif} alt="" className="h-full w-full border-2 border-paper object-cover" />
                  ) : null}
                </span>
                <span>{item.dir}</span>
              </h3>
              <span className="w-8 shrink-0 text-right text-xl text-paper opacity-0 transition-opacity group-hover:opacity-100 md:w-12 md:text-2xl">↘</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GifList;
