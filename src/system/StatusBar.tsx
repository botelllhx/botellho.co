import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const NOMES: Record<string, string> = {
  "/": "início",
  "/estudio": "estúdio",
  "/trabalhos": "trabalhos",
  "/laboratorio": "laboratório",
  "/contato": "contato",
};

// Barra de status (HUD): rotulos claros em PT, sem jargao. Progresso de
// leitura a direita.
const StatusBar = () => {
  const { pathname } = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const nome = NOMES[pathname] ?? pathname.replace(/^\//, "").split("/")[0];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 hidden h-7 items-center justify-between border-t border-foreground/15 bg-background px-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:flex" aria-hidden>
      <span>seção · {nome}</span>
      <span className="hidden lg:block">botellho · estúdio de web</span>
      <span>leitura <span className="text-phosphor">{String(progress).padStart(2, "0")}%</span></span>
    </div>
  );
};

export default StatusBar;
