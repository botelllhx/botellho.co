import { Link } from "react-router-dom";

const TAPE = "botellho · estúdio de web e experiências digitais · disponível para projetos · ";

// Rodape como momento: fita, contato, e um wordmark gigante dithered que
// resolve o dither no hover. O selo do Ban e a dica do easter egg fecham.
const SiteFooter = () => {
  return (
    <footer className="dark border-t border-foreground/15 bg-background pb-10 text-foreground">
      <div className="tape border-b border-foreground/15 py-5" aria-hidden>
        <div className="tape-track">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="type-label mx-6 text-foreground/50">{TAPE}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-12 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div>
          <span className="type-label text-muted-foreground">&gt; contato</span>
          <a
            href="mailto:contato@botellho.com"
            className="mt-4 block font-mono text-xl text-foreground underline-offset-4 transition-colors hover:text-phosphor md:text-3xl"
          >
            contato@botellho.com
          </a>
          <p className="mt-4 flex items-center gap-3 font-sans text-sm leading-relaxed text-muted-foreground">
            <img src="/ban/ban-1.png" alt="" className="h-9 w-9 object-contain" style={{ imageRendering: "pixelated" }} />
            Estúdio de web e experiências digitais para marcas, cultura e
            instituições que querem ser lembradas.
          </p>
        </div>

        <nav aria-label="rodapé">
          <span className="type-label text-muted-foreground">&gt; navegar</span>
          <ul className="mt-4 space-y-2">
            {[
              { to: "/", label: "/home" },
              { to: "/estudio", label: "/estudio" },
              { to: "/trabalhos", label: "/trabalhos" },
              { to: "/laboratorio", label: "/laboratorio" },
              { to: "/contato", label: "/contato" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="font-mono text-sm text-foreground/70 transition-colors hover:text-phosphor">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <span className="type-label text-muted-foreground">&gt; rede</span>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="https://instagram.com/botellho.co" target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-foreground/70 transition-colors hover:text-phosphor">instagram</a>
            </li>
          </ul>
          <p className="type-dos mt-8 text-xs text-muted-foreground">&gt; pressione / para o terminal</p>
        </div>
      </div>

      {/* Wordmark gigante dithered */}
      <div className="overflow-hidden px-2" data-cursor="3d">
        <span className="wordmark select-none">botellho</span>
      </div>

      <div className="mt-8 flex flex-col gap-2 px-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <span>© 2026 botellho. Todos os direitos reservados.</span>
        <span>feito em belo horizonte · <span className="text-phosphor">fósforo azul</span></span>
      </div>
    </footer>
  );
};

export default SiteFooter;
