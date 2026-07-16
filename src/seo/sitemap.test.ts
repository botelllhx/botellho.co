import { describe, it, expect } from "vitest";
import { gerarSitemap, hoje, STATIC_ROUTES, SITE_URL } from "./sitemap";

// O sitemap quebra CALADO: o build passa, o site sobe, e so o Google percebe.
// Por isso ele e testado.
describe("sitemap", () => {
  it("gera XML valido com o cabecalho e o namespace certos", () => {
    const xml = gerarSitemap([], "2026-01-01");
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml.trimEnd().endsWith("</urlset>")).toBe(true);
  });

  it("inclui todas as rotas estaticas, em portugues", () => {
    const xml = gerarSitemap([], "2026-01-01");
    for (const rota of STATIC_ROUTES) {
      const loc = rota.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${rota.path}`;
      expect(xml).toContain(`<loc>${loc}</loc>`);
    }
    // as rotas EN antigas sao redirect de cliente: nao entram no sitemap
    expect(xml).not.toContain("/work");
    expect(xml).not.toContain("/studio");
    expect(xml).not.toContain("/lab<");
  });

  it("nao publica a area privada", () => {
    const xml = gerarSitemap(["caso-a"], "2026-01-01");
    expect(xml).not.toContain("/admin");
  });

  it("adiciona um <url> por case publicado", () => {
    const xml = gerarSitemap(["apoena", "site-fcs"], "2026-01-01");
    expect(xml).toContain(`<loc>${SITE_URL}/trabalhos/apoena</loc>`);
    expect(xml).toContain(`<loc>${SITE_URL}/trabalhos/site-fcs</loc>`);
    const total = (xml.match(/<url>/g) ?? []).length;
    expect(total).toBe(STATIC_ROUTES.length + 2);
  });

  it("sem cases (dev local, sem credenciais), so as rotas estaticas", () => {
    const xml = gerarSitemap([], "2026-01-01");
    expect((xml.match(/<url>/g) ?? []).length).toBe(STATIC_ROUTES.length);
    expect(xml).not.toContain("/trabalhos/");
  });

  it("propaga o lastmod pra toda entrada", () => {
    const xml = gerarSitemap(["apoena"], "2026-03-14");
    const marcas = xml.match(/<lastmod>2026-03-14<\/lastmod>/g) ?? [];
    expect(marcas.length).toBe(STATIC_ROUTES.length + 1);
  });

  it("escapa caractere que quebraria o XML no slug", () => {
    const xml = gerarSitemap(["a&b"], "2026-01-01");
    expect(xml).toContain("a&amp;b");
    // um & cru invalidaria o documento inteiro
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;)/);
  });

  it("hoje() devolve no formato YYYY-MM-DD que o sitemap espera", () => {
    expect(hoje()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
