// Fonte unica das rotas publicas: alimenta o pre-render (SSG) e o sitemap.
// Vive fora do vite.config pra poder ser testado — o sitemap quebra CALADO
// (ninguem percebe no build, so o Google) e e exatamente o tipo de coisa que
// precisa de teste.
export const SITE_URL = "https://botellho.com";

export interface RotaEstatica {
  path: string;
  changefreq: string;
  priority: string;
}

export const STATIC_ROUTES: RotaEstatica[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/sobre", changefreq: "monthly", priority: "0.8" },
  { path: "/trabalhos", changefreq: "weekly", priority: "0.9" },
  { path: "/laboratorio", changefreq: "weekly", priority: "0.7" },
  { path: "/contato", changefreq: "monthly", priority: "0.6" },
];

const escapar = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Monta o XML do sitemap. Puro: recebe os slugs e a data, devolve string. */
export const gerarSitemap = (slugs: string[], lastmod: string): string => {
  const entradas = [
    ...STATIC_ROUTES.map((r) => ({
      loc: r.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${r.path}`,
      changefreq: r.changefreq,
      priority: r.priority,
    })),
    ...slugs.map((slug) => ({
      loc: `${SITE_URL}/trabalhos/${escapar(slug)}`,
      changefreq: "monthly",
      priority: "0.7",
    })),
  ];
  const urls = entradas
    .map((e) =>
      [
        "  <url>",
        `    <loc>${e.loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${e.changefreq}</changefreq>`,
        `    <priority>${e.priority}</priority>`,
        "  </url>",
      ].join("\n"),
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

/** Data de hoje em YYYY-MM-DD, o formato que o sitemap espera no lastmod. */
export const hoje = (): string => new Date().toISOString().slice(0, 10);
