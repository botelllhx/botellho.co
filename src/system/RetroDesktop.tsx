import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Ambiente de desktop antigo (webamp/poolsuite) pra sessao de contato: barra de
// menu, relogio, icones da area de trabalho e a janela do formulario por cima,
// arrastavel e presa a esta area (data-window-bounds).

// Icones pixel retro (silhuetas preenchidas, buracos por evenodd), invertem
// limpo no hover porque sao monocromaticos (currentColor).
const svgProps = { viewBox: "0 0 24 24", className: "h-7 w-7", fill: "currentColor", fillRule: "evenodd" as const, clipRule: "evenodd" as const, style: { shapeRendering: "crispEdges" as const } };
const IconeMonitor = () => (
  <svg {...svgProps}><path d="M2 4h20v12H2zM4 6h16v8H4zM9 16h6v3H9zM6 19h12v2H6z" /></svg>
);
const IconeFolder = () => (
  <svg {...svgProps}><path d="M2 6h6l2 2h12v11H2zM4 11h16v1H4z" /></svg>
);
const IconeFloppy = () => (
  <svg {...svgProps}><path d="M3 3h15l3 3v15H3zM13 4h2v5h-2zM7 13h10v6H7zM9 15h6v1H9z" /></svg>
);
const IconeDoc = () => (
  <svg {...svgProps}><path d="M5 2h8l6 6v14H5zM8 12h8v1H8zM8 15h8v1H8zM8 18h5v1H8z" /></svg>
);
const IconeLixeira = () => (
  <svg {...svgProps}><path d="M4 5h16v2H4zM9 3h6v2H9zM6 8h12l-1 13H7zM10 11h1v7h-1zM13 11h1v7h-1z" /></svg>
);

interface IconeProps {
  label: string;
  to?: string;
  children: ReactNode;
}
const Icone = ({ label, to, children }: IconeProps) => {
  const inner = (
    <>
      <span className="flex h-14 w-14 items-center justify-center border-2 border-ink bg-paper text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
        {children}
      </span>
      <span className="max-w-[70px] truncate px-1 font-mono text-[11px] text-paper group-hover:bg-paper group-hover:text-ink">{label}</span>
    </>
  );
  const cls = "group flex w-[72px] flex-col items-center gap-1 text-center";
  return to ? <Link to={to} className={cls} data-cursor-label="[ abrir ]">{inner}</Link> : <button type="button" className={cls}>{inner}</button>;
};

interface RetroDesktopProps {
  children: ReactNode;
}
const RetroDesktop = ({ children }: RetroDesktopProps) => {
  const [clock, setClock] = useState("--:--");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div data-window-bounds className="relative min-h-[78vh] overflow-hidden border-2 border-paper/40 bg-phosphor">
      {/* barra de menu */}
      <div className="flex items-center justify-between border-b-2 border-paper/40 bg-paper px-3 py-1 font-mono text-xs text-ink">
        <div className="flex items-center gap-4">
          <span className="font-bold">botellho.sys</span>
          <span className="hidden sm:inline">arquivo</span>
          <span className="hidden sm:inline">editar</span>
          <span className="hidden sm:inline">ajuda</span>
        </div>
        <span className="tabular-nums">{clock}</span>
      </div>

      {/* icones da area de trabalho */}
      <div className="pointer-events-none absolute left-4 top-14 flex flex-col gap-5">
        <div className="pointer-events-auto"><Icone label="trabalhos" to="/trabalhos"><IconeFolder /></Icone></div>
        <div className="pointer-events-auto"><Icone label="estúdio" to="/estudio"><IconeMonitor /></Icone></div>
        <div className="pointer-events-auto"><Icone label="laboratório" to="/laboratorio"><IconeFloppy /></Icone></div>
        <div className="pointer-events-auto"><Icone label="leia-me"><IconeDoc /></Icone></div>
        <div className="pointer-events-auto">
          <Icone label="ban.bmp">
            <img src="/ban/ban-mark.png" alt="" className="h-7 w-9 object-contain" style={{ imageRendering: "pixelated" }} />
          </Icone>
        </div>
        <div className="pointer-events-auto"><Icone label="lixeira"><IconeLixeira /></Icone></div>
      </div>

      {/* a janela (formulario) por cima */}
      <div className="relative flex justify-center px-4 py-10 md:justify-end md:px-10">
        {children}
      </div>
    </div>
  );
};

export default RetroDesktop;
