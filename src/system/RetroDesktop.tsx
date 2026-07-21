import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Ambiente de desktop antigo (webamp/poolsuite) pra sessao de contato: barra de
// menu, relogio, icones da area de trabalho e a janela do formulario por cima,
// arrastavel e presa a esta area (data-window-bounds).

// Icones da biblioteca pixelarticons (pixelarticons.com, MIT). Monocromaticos
// (currentColor), entao invertem limpo no hover. Path data inline pra nao
// depender de loader de svg no build SSG.
const svgProps = { viewBox: "0 0 24 24", className: "h-7 w-7", fill: "currentColor" };
const IconeFolder = () => (
  <svg {...svgProps}><path d="M4 4h6v2H4zm0 14h16v2H4zM20 8h2v10h-2zM2 6h2v12H2zm8 0h10v2H10z" /></svg>
);
const IconeMonitor = () => (
  <svg {...svgProps}><path d="M6 1h12v2H6zm0 8h12v2H6zM4 3h2v6H4zm14 0h2v6h-2zM4 13h16v2H4zm0 8h16v2H4zm-2-6h2v6H2zm18 0h2v6h-2zM6 17h2v2H6zm4 0h8v2h-8zm-2-6h2v2H8zm6 0h2v2h-2z" /></svg>
);
const IconeFloppy = () => (
  <svg {...svgProps}><path d="M20 22H4V20H6V14H8V20H16V14H18V20H20V22ZM4 20H2V4H4V20ZM22 20H20V6H22V20ZM16 14H8V12H16V14ZM12 10H6V6H12V10ZM20 6H18V4H20V6ZM18 4H4V2H18V4Z" /></svg>
);
const IconeDoc = () => (
  <svg {...svgProps}>
    <path d="M6 4H4v16h2zm10-2H6v2h10zm4 4h-2v14h2zm-2 14H6v2h12zM16 4h2v2h-2zm-4 0h2v6h-2z" />
    <path d="M12 8h6v2h-6zm-4 8h8v2H8zm0-4h8v2H8zm0-4h2v2H8z" />
  </svg>
);
const IconeLixeira = () => (
  <svg {...svgProps}><path d="M6 7h2v2H6zm14 0h2v10h-2zM8 5h12v2H8zM4 9h2v2H4zm-2 2h2v2H2zm2 2h2v2H4zm2 2h2v2H6zm2 2h12v2H8zm6-6h2v2h-2zm2 2h2v2h-2zm0-4h2v2h-2zm-4 4h2v2h-2zm0-4h2v2h-2z" /></svg>
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
        <div className="pointer-events-auto"><Icone label="sobre" to="/sobre"><IconeMonitor /></Icone></div>
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
