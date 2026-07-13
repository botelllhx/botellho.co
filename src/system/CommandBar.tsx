import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

// Barra de comando: a navegacao e a linha de prompt do terminal.
const COMMANDS = [
  { to: "/estudio", label: "/estudio" },
  { to: "/trabalhos", label: "/trabalhos" },
  { to: "/laboratorio", label: "/laboratorio" },
  { to: "/contato", label: "/contato" },
];

const CommandBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-[var(--bar-h)] border-b border-foreground/10 bg-background/95 backdrop-blur-sm">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          <Link
            to="/"
            className="font-mono text-sm font-bold tracking-tight text-foreground"
            aria-label="botellho, ir para a home"
          >
            botellho<span className="text-phosphor">&gt;</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="principal">
            {COMMANDS.map((command) => (
              <NavLink
                key={command.to}
                to={command.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 font-mono text-xs tracking-wider transition-colors duration-[180ms] ${
                    isActive
                      ? "bg-phosphor text-paper"
                      : "text-foreground/70 hover:bg-foreground hover:text-background"
                  }`
                }
              >
                {command.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-palette"))}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-phosphor"
              aria-label="Abrir terminal de comandos"
            >
              [ / ]
            </button>
            <Link to="/contato" className="cmd-button !py-1.5 text-[11px]">
              Começar um projeto
            </Link>
          </div>

          <button
            type="button"
            className="font-mono text-xs uppercase tracking-widest text-foreground md:hidden"
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "[fechar]" : "[menu]"}
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 bg-background pt-[var(--bar-h)] md:hidden">
          <nav className="flex h-full flex-col justify-center gap-2 px-6" aria-label="principal móvel">
            <span className="type-label mb-4 text-muted-foreground">&gt; navegar</span>
            {[{ to: "/", label: "/home" }, ...COMMANDS].map((command, index) => (
              <NavLink
                key={command.to}
                to={command.to}
                onClick={() => setOpen(false)}
                className="type-title py-2 text-foreground transition-colors hover:text-phosphor"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {command.label}
              </NavLink>
            ))}
            <Link to="/contato" onClick={() => setOpen(false)} className="cmd-button mt-8 self-start">
              Começar um projeto
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
};

export default CommandBar;
