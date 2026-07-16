import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface WindowProps {
  title: ReactNode;
  phosphor?: boolean;
  bodyClassName?: string;
  className?: string;
  /** janela arrastavel pela barra de titulo (desktop) */
  draggable?: boolean;
  /** limita o arrasto ao ancestral com data-window-bounds */
  bounded?: boolean;
  children: ReactNode;
}

// Janela DOS (window chrome), arrastavel pela barra de titulo. Com bounded, o
// arrasto fica preso a area (o ancestral com data-window-bounds), pra nao
// escapar da sessao. Sem isso o conceito de janela nao se sustenta.
const Window = ({ title, phosphor, bodyClassName, className, draggable = true, bounded = false, children }: WindowProps) => {
  const root = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ px: number; py: number; ox: number; oy: number; minX: number; maxX: number; minY: number; maxY: number } | null>(null);

  const onMove = useCallback((e: MouseEvent) => {
    const d = drag.current;
    if (!d) return;
    let nx = d.ox + (e.clientX - d.px);
    let ny = d.oy + (e.clientY - d.py);
    nx = Math.max(d.minX, Math.min(d.maxX, nx));
    ny = Math.max(d.minY, Math.min(d.maxY, ny));
    setPos({ x: nx, y: ny });
  }, []);
  const onUp = useCallback(() => {
    drag.current = null;
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [onMove, onUp]);

  const onBarDown = (e: React.MouseEvent) => {
    if (!draggable || window.matchMedia("(pointer: coarse)").matches) return;
    const el = root.current;
    let minX = -Infinity;
    let maxX = Infinity;
    let minY = -Infinity;
    let maxY = Infinity;
    const container = bounded && el ? el.closest("[data-window-bounds]") : null;
    if (container && el) {
      const br = container.getBoundingClientRect();
      const wr = el.getBoundingClientRect();
      const baseLeft = wr.left - pos.x;
      const baseTop = wr.top - pos.y;
      minX = br.left - baseLeft;
      maxX = br.right - wr.width - baseLeft;
      minY = br.top - baseTop;
      maxY = br.bottom - wr.height - baseTop;
    }
    drag.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y, minX, maxX, minY, maxY };
    document.body.style.userSelect = "none";
  };

  return (
    <div ref={root} className={`win ${className ?? ""}`} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
      <div
        className={`win__bar ${phosphor ? "win__bar--phosphor" : ""} ${draggable ? "win__bar--drag" : ""}`}
        onMouseDown={onBarDown}
        onDoubleClick={() => setPos({ x: 0, y: 0 })}
      >
        <span className="win__title">{title}</span>
        <span className="win__widgets" aria-hidden>
          <i className="win__widget">▁</i>
          <i className="win__widget">▢</i>
          <i className="win__widget">✕</i>
        </span>
      </div>
      <div className={`win__body ${bodyClassName ?? ""}`}>{children}</div>
    </div>
  );
};

export default Window;
