import { ElementType, ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./prefs";

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}

// Reveal de bloco preso ao scroll (para janelas, cards, mídias). O texto usa
// LineReveal/SignalText; isto é para os contêineres.
const Reveal = ({ as: Tag = "div", children, className, y = 28, delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "expo.out",
        delay,
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

export default Reveal;
