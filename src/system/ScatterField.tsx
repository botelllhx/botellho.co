import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scramble from "@/motion/Scramble";
import { prefersReducedMotion } from "@/motion/prefs";

// Campo de blocos a la Locomotive (pagina de carreiras): frases em blocos azuis
// espalhados por uma area alta (>100vh), cada um com parallax de velocidade
// propria no scroll e o texto se organizando (scramble). Fundo branco.
const BLOCOS = [
  { texto: "web que se move", left: "4%", top: "6%", size: "text-4xl md:text-6xl", speed: -90 },
  { texto: "craft primeiro", left: "58%", top: "2%", size: "text-3xl md:text-5xl", speed: 120 },
  { texto: "3d de verdade", left: "30%", top: "26%", size: "text-5xl md:text-7xl", speed: -160 },
  { texto: "sem firula", left: "70%", top: "34%", size: "text-3xl md:text-5xl", speed: 70 },
  { texto: "direção de arte", left: "6%", top: "48%", size: "text-4xl md:text-6xl", speed: 150 },
  { texto: "engenharia real", left: "52%", top: "58%", size: "text-4xl md:text-6xl", speed: -110 },
  { texto: "feito à mão", left: "22%", top: "72%", size: "text-3xl md:text-5xl", speed: 90 },
  { texto: "no prazo", left: "68%", top: "80%", size: "text-5xl md:text-7xl", speed: -70 },
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
          {
            y: speed,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="overflow-hidden bg-background px-4 py-20 md:px-6 md:py-28">
      <span className="type-label text-muted-foreground">como a gente trabalha</span>

      {/* desktop: campo espalhado com parallax */}
      <div ref={root} className="relative mt-8 hidden h-[130vh] md:block">
        {BLOCOS.map((b) => (
          <div
            key={b.texto}
            data-speed={b.speed}
            className="absolute"
            style={{ left: b.left, top: b.top }}
          >
            <Scramble
              as="span"
              text={b.texto}
              className={`inline-block bg-phosphor px-5 py-3 font-display leading-none text-paper ${b.size}`}
            />
          </div>
        ))}
      </div>

      {/* mobile: blocos empilhados, ainda com scramble */}
      <div className="mt-8 flex flex-col items-start gap-4 md:hidden">
        {BLOCOS.map((b) => (
          <Scramble
            key={b.texto}
            as="span"
            text={b.texto}
            className="inline-block bg-phosphor px-4 py-2 font-display text-3xl leading-none text-paper"
          />
        ))}
      </div>
    </section>
  );
};

export default ScatterField;
