import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./prefs";

interface PinnedRowProps {
  children: ReactNode;
  className?: string;
}

// Galeria horizontal pinada (scroll como narrativa): a seção fixa enquanto o
// scroll vertical conduz a faixa na horizontal. NÃO é carrossel automático.
// Em reduced-motion ou telas pequenas, vira scroll horizontal comum.
const PinnedRow = ({ children, className }: PinnedRowProps) => {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || window.innerWidth < 900) return;
    const w = wrap.current;
    const t = track.current;
    if (!w || !t) return;
    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.to(t, {
      x: () => -(t.scrollWidth - window.innerWidth + 48),
      ease: "none",
      scrollTrigger: {
        trigger: w,
        start: "top top",
        end: () => `+=${t.scrollWidth - window.innerWidth + 48}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(t, { clearProps: "x" });
    };
  }, []);

  return (
    <div ref={wrap} className="overflow-hidden">
      <div
        ref={track}
        className={`flex gap-5 overflow-x-auto px-4 md:overflow-x-visible md:px-6 ${className ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default PinnedRow;
