import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "@/motion/prefs";

// Transicao de rota (Secao 5.7): a tela nova revela saindo de um padrao de
// dither que se dissolve em degraus (uma linguagem so, dither wipe).
// O conteudo novo ja existe no HTML; o efeito e overlay progressivo.
const RouteTransition = () => {
  const { pathname } = useLocation();
  const isFirst = useRef(true);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.scrollTo(0, 0);
    if (prefersReducedMotion()) return;
    setWiping(true);
    const timer = setTimeout(() => setWiping(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!wiping) return null;
  return <div className="route-wipe" aria-hidden />;
};

export default RouteTransition;
