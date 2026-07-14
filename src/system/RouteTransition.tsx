import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "@/motion/prefs";

// Transicao de rota: um painel limpo (paper) com uma linha de fosforo que
// cobre e sobe revelando a nova rota. Elegante, sem dither. Reseta o scroll.
const RouteTransition = () => {
  const { pathname } = useLocation();
  const first = useRef(true);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    if (prefersReducedMotion()) return;
    setWiping(true);
    const t = setTimeout(() => setWiping(false), 520);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!wiping) return null;
  return <div className="page-wipe" aria-hidden />;
};

export default RouteTransition;
