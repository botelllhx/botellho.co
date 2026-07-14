import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Ambiente de desktop antigo (webamp/poolsuite) pra sessao de contato: barra de
// menu, relogio, icones da area de trabalho e a janela do formulario por cima,
// arrastavel e presa a esta area (data-window-bounds).

const IconeFolder = () => (
  <svg viewBox="0 0 16 16" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M1.5 4.5h4l1.2 1.3h7.8v8H1.5z" />
  </svg>
);
const IconeDoc = () => (
  <svg viewBox="0 0 16 16" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M3.5 1.5h6l3 3v10h-9z" />
    <path d="M5.5 6.5h5M5.5 9h5M5.5 11.5h3" />
  </svg>
);
const IconeFrasco = () => (
  <svg viewBox="0 0 16 16" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M6.5 1.5h3M7 1.5v5L3.5 13a1 1 0 0 0 .9 1.5h7.2a1 1 0 0 0 .9-1.5L9 6.5v-5" />
  </svg>
);
const IconeLixeira = () => (
  <svg viewBox="0 0 16 16" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M3 4.5h10M6 4.5V2.5h4v2M4.5 4.5l.8 9.5h5.4l.8-9.5" />
  </svg>
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
        <div className="pointer-events-auto"><Icone label="estúdio" to="/estudio"><IconeDoc /></Icone></div>
        <div className="pointer-events-auto"><Icone label="laboratório" to="/laboratorio"><IconeFrasco /></Icone></div>
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
