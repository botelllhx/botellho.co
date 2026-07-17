import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";

// O chunk do canvas sao ~1.8MB: e o import mais provavel de nao chegar. Se ele
// falhar sem ninguem segurar, o erro sobe ate o React Router e apaga A HOME por
// causa de um enfeite. Nao da pra reproduzir isso no navegador do painel: a aba
// fica hidden, o IntersectionObserver nao dispara e o hero nunca tenta carregar.
// Dai o teste.
const mock = vi.hoisted(() => ({ falhar: false }));

vi.mock("./HeroDiorama", () => ({
  // React.lazy transforma a rejeicao do import() num throw no render: e ali que o
  // boundary age, entao simular no render e fiel ao mecanismo.
  default: () => {
    if (mock.falhar) {
      throw new Error("Failed to fetch dynamically imported module: /assets/HeroDiorama-x.js");
    }
    return <div data-testid="canvas" />;
  },
}));

vi.mock("@/motion/prefs", () => ({ prefersReducedMotion: () => false }));

class IOFake {
  private cb: IntersectionObserverCallback;
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
  }
  disconnect() {}
  unobserve() {}
}

let erroOriginal: typeof console.error;
beforeAll(() => {
  erroOriginal = console.error;
  console.error = vi.fn();
});
afterAll(() => {
  console.error = erroOriginal;
});

beforeEach(() => {
  vi.resetModules();
  mock.falhar = false;
  vi.stubGlobal("IntersectionObserver", IOFake);
  // aparelho "forte", senao o HeroSlot nem tenta o 3D
  vi.stubGlobal("navigator", { hardwareConcurrency: 8, deviceMemory: 8 });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const montar = async () => {
  const HeroSlot = (await import("./HeroSlot")).default;
  const hero = await import("@/system/heroPronto");
  return { tela: render(<HeroSlot />), hero };
};

describe("HeroSlot", () => {
  it("com tudo certo, monta o canvas", async () => {
    await montar();
    await waitFor(() => expect(screen.queryByTestId("canvas")).not.toBeNull());
  });

  it("canvas que falha nao derruba a pagina", async () => {
    mock.falhar = true;
    const { tela } = await montar();
    await waitFor(() => expect(screen.queryByTestId("canvas")).toBeNull());
    // o container continua: o hero vira campo vazio, e nao uma tela de erro
    expect(tela.container.querySelector("div")).toBeTruthy();
  });

  it("canvas que falha SOLTA o boot: senao ele esperaria o teto inteiro", async () => {
    mock.falhar = true;
    const { hero } = await montar();
    await waitFor(() => expect(hero.heroJaPronto()).toBe(true));
  });
});
