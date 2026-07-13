import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV = [
  { n: "01", to: "/estudio", label: "Estúdio" },
  { n: "02", to: "/trabalhos", label: "Trabalhos" },
  { n: "03", to: "/laboratorio", label: "Laboratório" },
  { n: "04", to: "/contato", label: "Contato" },
];

const CommandBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-[var(--bar-h)] border-b border-foreground/15 bg-background/95 backdrop-blur-sm">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-foreground" aria-label="botellho, início">
            botellho<span className="text-phosphor">▪</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="principal">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs tracking-wider transition-colors duration-[180ms] ${
                    isActive ? "bg-phosphor text-paper" : "text-foreground/70 hover:bg-foreground hover:text-background"
                  }`
                }
              >
                <span className="opacity-60">{item.n}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-palette"))}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-phosphor"
              aria-label="Abrir busca de comandos"
              title="Buscar (tecla /)"
            >
              ▚ buscar
            </button>
            <Link to="/contato" className="cmd-button !py-1.5 text-[11px]">Começar um projeto</Link>
          </div>

          <button
            type="button"
            className="font-mono text-xs uppercase tracking-widest text-foreground md:hidden"
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕ fechar" : "☰ menu"}
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 bg-background pt-[var(--bar-h)] md:hidden">
          <nav className="flex h-full flex-col justify-center gap-2 px-6" aria-label="principal móvel">
            <span className="type-label mb-4 text-muted-foreground">Navegar</span>
            {[{ n: "00", to: "/", label: "Início" }, ...NAV].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="type-title flex items-baseline gap-3 py-2 text-foreground transition-colors hover:text-phosphor"
              >
                <span className="font-mono text-sm text-phosphor">{item.n}</span>
                {item.label}
              </NavLink>
            ))}
            <Link to="/contato" onClick={() => setOpen(false)} className="cmd-button mt-8 self-start">Começar um projeto</Link>
          </nav>
        </div>
      ) : null}
    </>
  );
};

export default CommandBar;
