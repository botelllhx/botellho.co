import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Command palette (easter egg + navegacao em terminal): abre com "/" ou
// Ctrl/Cmd+K, ou pelo botao da barra. Digite uma rota e Enter navega;
// "ban" invoca o Ban. Esc fecha.
const COMMANDS = [
  { cmd: "home", to: "/" },
  { cmd: "sobre", to: "/sobre" },
  { cmd: "trabalhos", to: "/trabalhos" },
  { cmd: "laboratorio", to: "/laboratorio" },
  { cmd: "contato", to: "/contato" },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [ban, setBan] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (!open && !typing && e.key === "/") {
        e.preventDefault();
        setOpen(true);
      } else if (!open && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (open && e.key === "Escape") {
        setOpen(false);
        setBan(false);
        setQuery("");
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const matches = q ? COMMANDS.filter((c) => c.cmd.startsWith(q)) : COMMANDS;

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    if (q === "ban") {
      setBan(true);
      return;
    }
    const hit = matches[0];
    if (hit) {
      navigate(hit.to);
      setOpen(false);
      setQuery("");
      setBan(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-start justify-center bg-ink/80 pt-[18vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[min(92vw,560px)] border border-phosphor/60 bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-foreground/15 px-4 py-2">
          <span className="type-dos text-xs text-phosphor">terminal</span>
          <span className="type-label text-muted-foreground">esc fecha</span>
        </div>

        <form onSubmit={run} className="flex items-center gap-2 px-4 py-4">
          <span className="type-dos text-sm text-phosphor">botellho&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setBan(false); }}
            placeholder="digite uma rota (ou 'ban')"
            className="caret w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </form>

        {ban ? (
          <div className="flex flex-col items-center gap-2 border-t border-foreground/15 px-4 py-6">
            <img src="/ban/ban-1.png" alt="Ban, o mascote" className="h-28 w-28 object-contain" style={{ imageRendering: "pixelated" }} />
            <p className="type-dos text-xs text-phosphor">au. (o ban manda um abraço)</p>
          </div>
        ) : (
          <ul className="border-t border-foreground/15 pb-2">
            {matches.map((c) => (
              <li key={c.cmd}>
                <button
                  type="button"
                  onClick={() => { navigate(c.to); setOpen(false); setQuery(""); }}
                  className="dir-row block w-full px-4 py-2 text-left font-mono text-sm"
                >
                  <span className="text-phosphor">&gt;</span> {c.cmd}
                </button>
              </li>
            ))}
            {matches.length === 0 ? (
              <li className="px-4 py-2 font-mono text-sm text-muted-foreground">sem rota. tente 'ban'.</li>
            ) : null}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommandPalette;
