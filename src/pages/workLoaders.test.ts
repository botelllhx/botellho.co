import { describe, it, expect, vi, beforeEach } from "vitest";

// Os loaders rodam no build (SSG) e no client. Falham calado: sem Supabase eles
// devolvem vazio de proposito, e um filtro quebrado vazaria case NAO publicado
// pro ar sem ninguem perceber. Dai o teste.

// encadeamento do supabase-js: .from().select().eq()... termina em await ou maybeSingle
const criarQuery = (resultado: { data: unknown; error: unknown }) => {
  const q: Record<string, unknown> = {};
  const chamadas: { metodo: string; args: unknown[] }[] = [];
  for (const m of ["select", "eq", "order"]) {
    q[m] = (...args: unknown[]) => {
      chamadas.push({ metodo: m, args });
      return q;
    };
  }
  q.maybeSingle = () => Promise.resolve(resultado);
  // o loader de lista da await direto na query
  q.then = (ok: (v: unknown) => unknown) => Promise.resolve(resultado).then(ok);
  q.__chamadas = chamadas;
  return q;
};

const mockCliente = { isSupabaseConfigured: true, supabase: null as unknown };

vi.mock("@/integrations/supabase/client", () => ({
  get isSupabaseConfigured() {
    return mockCliente.isSupabaseConfigured;
  },
  get supabase() {
    return mockCliente.supabase;
  },
}));

const carregar = async () => await import("./workLoaders");

beforeEach(() => {
  vi.resetModules();
  mockCliente.isSupabaseConfigured = true;
  mockCliente.supabase = null;
});

describe("worksLoader", () => {
  it("sem Supabase configurado, devolve vazio e avisa (nao explode o build)", async () => {
    mockCliente.isSupabaseConfigured = false;
    const { worksLoader } = await carregar();
    expect(await worksLoader()).toEqual({ projects: [], configured: false });
  });

  it("pede SO os publicados, ordenados", async () => {
    const q = criarQuery({ data: [{ slug: "a" }], error: null });
    mockCliente.supabase = { from: () => q };
    const { worksLoader } = await carregar();
    const r = await worksLoader();

    expect(r.projects).toHaveLength(1);
    expect(r.configured).toBe(true);
    const eq = (q.__chamadas as { metodo: string; args: unknown[] }[]).find((c) => c.metodo === "eq");
    expect(eq?.args).toEqual(["status", "published"]);
  });

  it("erro do Supabase nao derruba a pagina: devolve vazio", async () => {
    mockCliente.supabase = { from: () => criarQuery({ data: null, error: { message: "falhou" } }) };
    const { worksLoader } = await carregar();
    expect(await worksLoader()).toEqual({ projects: [], configured: true });
  });

  it("data null vira lista vazia, nao undefined", async () => {
    mockCliente.supabase = { from: () => criarQuery({ data: null, error: null }) };
    const { worksLoader } = await carregar();
    expect((await worksLoader()).projects).toEqual([]);
  });
});

describe("workCaseLoader", () => {
  const args = (slug?: string) =>
    ({ params: { slug }, request: new Request("http://x"), context: {} }) as never;

  it("sem slug, devolve null", async () => {
    mockCliente.supabase = { from: () => criarQuery({ data: {}, error: null }) };
    const { workCaseLoader } = await carregar();
    expect((await workCaseLoader(args(undefined))).project).toBeNull();
  });

  it("busca pelo slug E exige publicado", async () => {
    const q = criarQuery({ data: { slug: "apoena" }, error: null });
    mockCliente.supabase = { from: () => q };
    const { workCaseLoader } = await carregar();
    const r = await workCaseLoader(args("apoena"));

    expect(r.project).toEqual({ slug: "apoena" });
    const eqs = (q.__chamadas as { metodo: string; args: unknown[] }[]).filter((c) => c.metodo === "eq");
    expect(eqs.map((c) => c.args)).toEqual([
      ["slug", "apoena"],
      ["status", "published"],
    ]);
  });

  it("case inexistente devolve null, nao erro", async () => {
    mockCliente.supabase = { from: () => criarQuery({ data: null, error: null }) };
    const { workCaseLoader } = await carregar();
    expect((await workCaseLoader(args("nao-existe"))).project).toBeNull();
  });

  it("erro do Supabase devolve null", async () => {
    mockCliente.supabase = { from: () => criarQuery({ data: null, error: { message: "falhou" } }) };
    const { workCaseLoader } = await carregar();
    expect(await workCaseLoader(args("apoena"))).toEqual({ project: null, configured: true });
  });
});
