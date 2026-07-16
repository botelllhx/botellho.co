import { useRef, useState } from "react";

// Lista gigante centralizada a la Locomotive (carreiras): numeracao e linhas
// divisorias na estetica DOS, e no hover um clipe engracado abre INLINE no meio
// da frase (tipo "Project [clip] Manager").
//
// Sao VIDEO, nao gif: os originais somavam 19MB (o tema.gif sozinho tinha 13MB,
// 201 frames a 640px — era video salvo como gif). Em h264/vp9 o mesmo conteudo
// da 598KB no total, sem perda visivel: gif so tem 256 cores, entao o mp4 fica
// ate mais limpo. Segue lazy: so carrega depois do primeiro hover.
const ITENS = [
  { esq: "sem lorem", dir: "ipsum", clip: "lorem" },
  { esq: "sem tema", dir: "de prateleira", clip: "tema" },
  { esq: "sem powerpoint", dir: "infinito", clip: "powerpoint" },
  { esq: "reunião que", dir: "era e-mail", clip: "reuniao" },
  { esq: "sem site", dir: "travado", clip: "travado" },
  { esq: "sem preguiça", dir: "de detalhe", clip: "preguica" },
];

const GifList = () => {
  const [hover, setHover] = useState<number | null>(null);
  const [ativos, setAtivos] = useState<Set<number>>(new Set());
  const videos = useRef(new Map<number, HTMLVideoElement>());

  const entrar = (i: number) => {
    setHover(i);
    setAtivos((s) => (s.has(i) ? s : new Set(s).add(i)));
    // O clipe vive num span de largura ZERO que so abre no hover, e o Chrome nao
    // toca video de tamanho zero: o autoplay morre no primeiro frame e nunca mais
    // volta sozinho. Entao o play e pedido a cada hover, nao so no load.
    const v = videos.current.get(i);
    if (v) void v.play().catch(() => {});
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
                    // O gate de rede e o lazy (so monta apos o 1o hover), entao
                    // aqui preload="auto": com "none" o autoplay nao teria dados
                    // pra comecar e o clipe ficaria no frame zero.
                    <video
                      ref={(el) => {
                        if (el) videos.current.set(i, el);
                        else videos.current.delete(i);
                      }}
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      aria-hidden
                      onCanPlay={(e) => {
                        void (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                      }}
                      onError={(e) => {
                        // arquivo ausente: some sem quebrar o layout (mesmo
                        // contrato que o gif tinha antes)
                        (e.currentTarget as HTMLVideoElement).style.display = "none";
                      }}
                    >
                      <source src={`/gifs/${item.clip}.webm`} type="video/webm" />
                      <source src={`/gifs/${item.clip}.mp4`} type="video/mp4" />
                    </video>
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
