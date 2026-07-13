import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Barra de status: metadados vivos do terminal (rota, progresso de leitura).
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

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 hidden h-7 items-center justify-between border-t border-foreground/10 bg-background px-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:flex"
      aria-hidden
    >
      <span>
        &gt; {pathname === "/" ? "/home" : pathname}
      </span>
      <span className="hidden lg:block">botellho · estúdio</span>
      <span>
        <span className="text-phosphor">{String(progress).padStart(3, "0")}</span> / 100 ·
        disponível para projetos
      </span>
    </div>
  );
};

export default StatusBar;
