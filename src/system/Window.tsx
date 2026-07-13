import { ReactNode } from "react";

interface WindowProps {
  title: ReactNode;
  phosphor?: boolean;
  bodyClassName?: string;
  className?: string;
  children: ReactNode;
}

// Janela DOS (window chrome): barra de titulo com widgets e corpo. A forma
// profissional de fazer retro (98.css/system.css), com rotulo claro em PT.
const Window = ({ title, phosphor, bodyClassName, className, children }: WindowProps) => {
  return (
    <div className={`win ${className ?? ""}`}>
      <div className={`win__bar ${phosphor ? "win__bar--phosphor" : ""}`}>
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
