import { Link } from "react-router-dom";

// Rodape como momento: metadados estaticos (sem carrossel), contato, e um
// wordmark gigante que resolve o pixel no hover.
const SiteFooter = () => {
  return (
    <footer className="dark sticky bottom-0 z-0 border-t border-foreground/15 bg-background pb-10 text-foreground">
      <div className="metastrip border-b border-foreground/15 px-4 py-3 md:px-6" aria-hidden>
        <span className="type-label text-foreground/55">botellho</span>
        <span className="type-label text-phosphor">disponível para projetos</span>
        <span className="type-label text-foreground/55">belo horizonte, br</span>
        <span className="type-label text-foreground/55">web e experiências digitais</span>
      </div>

      <div className="grid gap-12 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div>
          <span className="type-label text-muted-foreground">Contato</span>
          <a href="mailto:contato@botellho.com" className="mt-4 block font-mono text-xl text-foreground underline-offset-4 transition-colors hover:text-phosphor md:text-3xl">
            contato@botellho.com
          </a>
          <p className="mt-4 flex items-center gap-3 font-sans text-sm leading-relaxed text-muted-foreground">
            <img src="/ban/ban-mark.png" alt="Ban, o mascote" className="h-8 w-14 object-contain invert" style={{ imageRendering: "pixelated" }} />
            Estúdio de web e experiências digitais para marcas, cultura e instituições que querem ser lembradas.
          </p>
        </div>

        <nav aria-label="rodapé">
          <span className="type-label text-muted-foreground">Navegar</span>
          <ul className="mt-4 space-y-2">
            {[
              { to: "/", label: "Início" },
              { to: "/estudio", label: "Estúdio" },
              { to: "/trabalhos", label: "Trabalhos" },
              { to: "/laboratorio", label: "Laboratório" },
              { to: "/contato", label: "Contato" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="font-mono text-sm text-foreground/70 transition-colors hover:text-phosphor">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <span className="type-label text-muted-foreground">Rede</span>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="https://instagram.com/botellho.co" target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-foreground/70 transition-colors hover:text-phosphor">Instagram</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="overflow-hidden px-2" data-cursor="3d">
        <span className="wordmark select-none">botellho</span>
      </div>

      <div className="mt-8 flex flex-col gap-2 px-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <span>© 2026 botellho. Todos os direitos reservados.</span>
        <span>feito em belo horizonte</span>
      </div>
    </footer>
  );
};

export default SiteFooter;
