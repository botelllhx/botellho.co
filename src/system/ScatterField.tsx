import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scramble from "@/motion/Scramble";
import { prefersReducedMotion } from "@/motion/prefs";

// Campo de textos a la Locomotive (rodape de carreiras): frases curtas em Inter
// espalhadas por uma area alta, cada uma se re-embaralhando o tempo todo, com
// modos e cadencias diferentes, e com parallax de velocidade propria no scroll.
// Fundo branco, azul so como cor de alguns textos (nunca bloco azul).
type Mode = "ltr" | "random" | "center";
interface Bloco {
  texto: string;
  left: string;
  top: string;
  size: string;
  azul?: boolean;
  mode: Mode;
  loopDelay: number;
  speed: number;
}

const BLOCOS: Bloco[] = [
  { texto: "a gente escreve o próprio código", left: "3%", top: "6%", size: "text-2xl md:text-3xl", mode: "ltr", loopDelay: 2600, speed: -110 },
  { texto: "3d que roda em qualquer máquina", left: "57%", top: "3%", size: "text-xl md:text-2xl", azul: true, mode: "random", loopDelay: 3300, speed: 150 },
  { texto: "design que passa no acessível", left: "28%", top: "22%", size: "text-2xl md:text-4xl", mode: "center", loopDelay: 2000, speed: -180 },
  { texto: "performance é parte do craft", left: "66%", top: "28%", size: "text-lg md:text-2xl", mode: "ltr", loopDelay: 3700, speed: 90 },
  { texto: "arte e engenharia na mesma mesa", left: "5%", top: "44%", size: "text-2xl md:text-3xl", azul: true, mode: "random", loopDelay: 2400, speed: 170 },
  { texto: "entrega no prazo combinado", left: "55%", top: "52%", size: "text-xl md:text-3xl", mode: "ltr", loopDelay: 3000, speed: -130 },
  { texto: "detalhe que ninguém pediu", left: "22%", top: "68%", size: "text-2xl md:text-4xl", mode: "center", loopDelay: 2900, speed: 120 },
  { texto: "sem tema pronto, sem atalho", left: "60%", top: "78%", size: "text-lg md:text-2xl", azul: true, mode: "ltr", loopDelay: 3500, speed: -80 },
];

const ScatterField = () => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-speed]").forEach((node) => {
        const speed = Number(node.dataset.speed);
        gsap.fromTo(
          node,
          { y: -speed },
          { y: speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="overflow-hidden bg-background px-4 py-20 md:px-6 md:py-28">
      <span className="type-label text-muted-foreground">como a gente trabalha</span>

      {/* desktop: campo espalhado com parallax, tudo animando o tempo todo */}
      <div ref={root} className="relative mt-8 hidden h-[130vh] md:block">
        {BLOCOS.map((b) => (
          <div key={b.texto} data-speed={b.speed} className="absolute max-w-[38ch]" style={{ left: b.left, top: b.top }}>
            <Scramble
              as="span"
              text={b.texto}
              loop
              loopDelay={b.loopDelay}
              mode={b.mode}
              className={`font-sans font-medium leading-tight ${b.size} ${b.azul ? "text-phosphor" : "text-foreground"}`}
            />
          </div>
        ))}
      </div>

      {/* mobile: empilhado, ainda re-embaralhando */}
      <div className="mt-8 flex flex-col items-start gap-6 md:hidden">
        {BLOCOS.map((b) => (
          <Scramble
            key={b.texto}
            as="span"
            text={b.texto}
            loop
            loopDelay={b.loopDelay}
            mode={b.mode}
            className={`font-sans text-2xl font-medium leading-tight ${b.azul ? "text-phosphor" : "text-foreground"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ScatterField;
