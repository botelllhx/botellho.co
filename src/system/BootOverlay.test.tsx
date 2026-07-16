import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act, cleanup } from "@testing-library/react";

// O boot quebra CALADO: se ele subir cedo demais a pessoa ve a tela abrir no
// vazio e o 3D pular pra dentro depois; se ficar esperando um hero que nunca
// chega, ela fica presa numa tela azul. Nenhum dos dois quebra o build, nenhum
// aparece em teste de tipo, e nao da pra reproduzir em aba de fundo (o
// IntersectionObserver nao dispara nela). Dai o teste.
vi.mock("@/motion/prefs", () => ({ prefersReducedMotion: () => false }));

const carregar = async () => {
  const Boot = (await import("./BootOverlay")).default;
  const hero = await import("./heroPronto");
  return { Boot, hero };
};

// tempos do BootOverlay
const MINIMO = 3300; // BOOT_MS + 300
const SAIDA = 750; // pronto -> comeca a subir
const TETO = 8000;

const boot = () => document.querySelector(".boot");
const subindo = () => !!document.querySelector(".boot--off");

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("BootOverlay", () => {
  it("nasce visivel: e o HTML estatico que cobre a tela antes do JS rodar", async () => {
    const { Boot } = await carregar();
    render(<Boot />);
    // sem avancar nenhum timer: no primeiro render ele ja tem que estar la
    expect(boot()).toBeTruthy();
    expect(subindo()).toBe(false);
  });

  it("sem 3D na pagina, sobe assim que a vinheta termina (nao espera nada)", async () => {
    const { Boot } = await carregar();
    render(<Boot />);
    act(() => void vi.advanceTimersByTime(MINIMO));
    act(() => void vi.advanceTimersByTime(SAIDA));
    expect(subindo()).toBe(true);
  });

  it("com 3D a caminho, NAO sobe enquanto o hero nao esta pronto", async () => {
    const { Boot, hero } = await carregar();
    hero.registrarHero();
    render(<Boot />);
    // passa folgadamente do tempo em que o boot antigo ja teria subido
    act(() => void vi.advanceTimersByTime(MINIMO + SAIDA + 1000));
    expect(subindo()).toBe(false);
    expect(boot()).toBeTruthy();
  });

  it("sobe quando o hero avisa que desenhou", async () => {
    const { Boot, hero } = await carregar();
    hero.registrarHero();
    render(<Boot />);
    act(() => void vi.advanceTimersByTime(MINIMO));
    expect(subindo()).toBe(false);

    act(() => hero.marcarHeroPronto());
    act(() => void vi.advanceTimersByTime(SAIDA));
    expect(subindo()).toBe(true);
  });

  it("teto: hero que nunca chega nao prende a pessoa na tela azul", async () => {
    const { Boot, hero } = await carregar();
    hero.registrarHero();
    render(<Boot />);
    act(() => void vi.advanceTimersByTime(TETO + SAIDA + 100));
    expect(subindo()).toBe(true);
  });

  it("hero que fica pronto ANTES da vinheta nao encurta o boot", async () => {
    const { Boot, hero } = await carregar();
    hero.registrarHero();
    hero.marcarHeroPronto();
    render(<Boot />);
    act(() => void vi.advanceTimersByTime(MINIMO - 500));
    expect(subindo()).toBe(false); // a vinheta tem um minimo
    act(() => void vi.advanceTimersByTime(500 + SAIDA));
    expect(subindo()).toBe(true);
  });

  it("so aparece uma vez: remontar (ex.: voltar do /admin) nao repete o boot", async () => {
    const { Boot } = await carregar();
    const primeira = render(<Boot />);
    act(() => void vi.advanceTimersByTime(MINIMO + SAIDA + 600));
    primeira.unmount();

    render(<Boot />);
    // na remontagem ele nem pode nascer visivel, senao pisca
    expect(boot()).toBeNull();
  });
});
