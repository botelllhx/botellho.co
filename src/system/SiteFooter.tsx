import { Link } from "react-router-dom";

const TAPE_ITEMS = "botellho · estúdio de web e experiências digitais · disponível para projetos · ";

// Rodape de status: fita lenta, contato direto e colofao em mono.
const SiteFooter = () => {
  return (
    <footer className="border-t border-foreground/10 pb-12 md:pb-16">
      {/* Fita */}
      <div className="tape border-b border-foreground/10 py-5" aria-hidden>
        <div className="tape-track">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="type-label mx-6 text-foreground/60">
              {TAPE_ITEMS}
            </span>
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
          <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
            Estúdio de web e experiências digitais para marcas, cultura e
            instituições que querem ser lembradas.
          </p>
        </div>

        <nav aria-label="rodapé">
          <span className="type-label text-muted-foreground">&gt; navegar</span>
          <ul className="mt-4 space-y-2">
            {[
              { to: "/", label: "/home" },
              { to: "/studio", label: "/studio" },
              { to: "/work", label: "/work" },
              { to: "/lab", label: "/lab" },
              { to: "/contact", label: "/contact" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="font-mono text-sm text-foreground/70 transition-colors hover:text-phosphor"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <span className="type-label text-muted-foreground">&gt; rede</span>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href="https://instagram.com/botellho.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-foreground/70 transition-colors hover:text-phosphor"
              >
                instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="rule mx-4 md:mx-6" />
      <div className="flex flex-col gap-2 px-4 pt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <span>© 2026 botellho. Todos os direitos reservados.</span>
        <span>
          feito em belo horizonte · <span className="text-phosphor">fósforo azul</span>
        </span>
      </div>
    </footer>
  );
};

export default SiteFooter;
