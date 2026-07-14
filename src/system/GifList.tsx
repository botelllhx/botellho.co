import { useState } from "react";

// Lista gigante centralizada (a la Locomotive): cada linha e enorme e, no hover,
// um gif engracado aparece no meio dos textos. Os gifs sao anexados depois pelo
// Mateus em /public/gifs (ver README). Antes disso o hover so nao mostra nada.
const ITENS = [
  { texto: "sem lorem ipsum", gif: "/gifs/lorem.gif" },
  { texto: "sem tema pronto", gif: "/gifs/tema.gif" },
  { texto: "sem powerpoint", gif: "/gifs/powerpoint.gif" },
  { texto: "sem reunião que era e-mail", gif: "/gifs/reuniao.gif" },
  { texto: "sem site travado", gif: "/gifs/travado.gif" },
  { texto: "sem preguiça", gif: "/gifs/preguica.gif" },
];

const GifList = () => {
  const [hover, setHover] = useState<number | null>(null);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  return (
    <section className="relative overflow-hidden bg-phosphor px-4 py-24 text-paper md:px-6 md:py-32">
      <span className="type-label text-paper/60">regras da casa</span>

      <div className="relative mt-10">
        <ul className="flex flex-col items-center text-center">
          {ITENS.map((item, i) => (
            <li key={item.texto}>
              <button
                type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className={`block py-2 font-display uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2.25rem,7vw,7rem)] transition-opacity duration-300 ${
                  hover !== null && hover !== i ? "opacity-25" : "opacity-100"
                }`}
              >
                {item.texto}
              </button>
            </li>
          ))}
        </ul>

        {/* gif no meio dos textos (aparece no hover) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 md:h-72 md:w-72">
          {ITENS.map((item, i) =>
            broken[i] ? null : (
              <img
                key={item.texto}
                src={item.gif}
                alt=""
                onError={() => setBroken((b) => ({ ...b, [i]: true }))}
                className={`absolute inset-0 h-full w-full border-2 border-paper object-cover shadow-[6px_6px_0_0_hsl(var(--ink))] transition-opacity duration-200 ${
                  hover === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default GifList;
