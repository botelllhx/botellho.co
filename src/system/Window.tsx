import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface WindowProps {
  title: ReactNode;
  phosphor?: boolean;
  bodyClassName?: string;
  className?: string;
  /** janela arrastavel pela barra de titulo (desktop) */
  draggable?: boolean;
  children: ReactNode;
}

// Janela DOS (window chrome), arrastavel pela barra de titulo. Sem isso o
// conceito de janela nao se sustenta (brand guide / direcao v3).
const Window = ({ title, phosphor, bodyClassName, className, draggable = true, children }: WindowProps) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  const onMove = useCallback((e: MouseEvent) => {
    if (!drag.current) return;
    setPos({ x: drag.current.ox + (e.clientX - drag.current.px), y: drag.current.oy + (e.clientY - drag.current.py) });
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
    drag.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
    document.body.style.userSelect = "none";
  };

  return (
    <div className={`win ${className ?? ""}`} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
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
