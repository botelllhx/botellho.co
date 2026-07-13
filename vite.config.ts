import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { writeFileSync } from "fs";
import { componentTagger } from "lovable-tagger";

const SITE_URL = "https://botellho.com";

// Rotas publicas reais do site. Fonte unica para o pre-render (SSG) e o sitemap.
const PUBLIC_ROUTES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/studio", changefreq: "monthly", priority: "0.8" },
];

const buildSitemap = (dir: string) => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = PUBLIC_ROUTES.map((route) => {
    const loc = route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      "  </url>",
    ].join("\n");
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  writeFileSync(path.join(dir, "sitemap.xml"), xml);
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssgOptions: {
    // Pre-renderiza apenas as rotas publicas seguras. A area /admin
    // e as rotas legadas dinamicas ficam fora do SSG.
    includedRoutes: () => PUBLIC_ROUTES.map((route) => route.path),
    // Gera o sitemap.xml no build com lastmod atual.
    onFinished: (dir: string) => buildSitemap(dir),
  },
}));
