import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { writeFileSync, readdirSync, rmSync, statSync } from "fs";

const SITE_URL = "https://botellho.com";

// Rotas publicas estaticas. Fonte para pre-render (SSG) e sitemap.
const STATIC_ROUTES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/estudio", changefreq: "monthly", priority: "0.8" },
  { path: "/trabalhos", changefreq: "weekly", priority: "0.9" },
  { path: "/laboratorio", changefreq: "weekly", priority: "0.7" },
  { path: "/contato", changefreq: "monthly", priority: "0.6" },
];

// Le os slugs de cases publicados no Supabase no momento do build.
// Sem credenciais (dev local), retorna vazio: os cases so pre-renderizam no CI.
async function getPublishedSlugs(mode: string): Promise<string[]> {
  const env = loadEnv(mode, process.cwd(), "");
  const url = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(url, key);
    const { data, error } = await sb
      .from("portfolio_projects")
      .select("slug")
      .eq("status", "published");
    if (error) return [];
    return (data ?? []).map((row: { slug: string }) => row.slug).filter(Boolean);
  } catch {
    return [];
  }
}

// Tudo em public/ vai pra raiz do dominio. Documento interno ali VAZA: a
// direcao criativa chegou a ficar publica em /docs/ e indexavel (o robots so
// bloqueia /admin). Os .md que sobram sao nota de trabalho e licenca de
// terceiros, nada que precise ser servido. Esta rede pega o proximo tambem.
const limparDocs = (dir: string) => {
  const varrer = (d: string) => {
    for (const nome of readdirSync(d)) {
      const alvo = path.join(d, nome);
      if (statSync(alvo).isDirectory()) varrer(alvo);
      else if (nome.toLowerCase().endsWith(".md")) rmSync(alvo);
    }
  };
  varrer(dir);
};

const buildSitemap = (dir: string, slugs: string[]) => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = [
    ...STATIC_ROUTES.map((route) => ({
      loc: route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`,
      changefreq: route.changefreq,
      priority: route.priority,
    })),
    ...slugs.map((slug) => ({
      loc: `${SITE_URL}/trabalhos/${slug}`,
      changefreq: "monthly",
      priority: "0.7",
    })),
  ];
  const urls = entries
    .map((entry) =>
      [
        "  <url>",
        `    <loc>${entry.loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
      ].join("\n"),
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  writeFileSync(path.join(dir, "sitemap.xml"), xml);
};

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const slugs = command === "build" ? await getPublishedSlugs(mode) : [];
  const prerenderRoutes = [
    ...STATIC_ROUTES.map((route) => route.path),
    ...slugs.map((slug) => `/trabalhos/${slug}`),
  ];

  return {
    server: {
      host: "::",
      port: Number(process.env.PORT) || 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    ssgOptions: {
      // Pre-renderiza as rotas publicas seguras (estaticas + cases publicados).
      // /admin e as rotas legadas ficam fora do SSG.
      includedRoutes: () => prerenderRoutes,
      // Gera o sitemap.xml no build com lastmod atual e os cases reais.
      onFinished: (dir: string) => {
        buildSitemap(dir, slugs);
        limparDocs(dir);
      },
    },
  };
});
