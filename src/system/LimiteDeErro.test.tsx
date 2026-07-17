import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import LimiteDeErro from "./LimiteDeErro";

// O boundary e a regra "peca acessoria nao decide se a pagina existe" virada em
// codigo. Se ele parar de segurar, um chunk que nao chega volta a apagar a pagina
// inteira, e isso nao quebra build nem tipo: quebra so em producao, com rede ruim.

const Quebra = ({ deve }: { deve: boolean }) => {
  if (deve) throw new Error("Failed to fetch dynamically imported module");
  return <div data-testid="filho">ok</div>;
};

// React loga o erro capturado no console; silencia pro output do teste ficar limpo
let erroOriginal: typeof console.error;
beforeAll(() => {
  erroOriginal = console.error;
  console.error = vi.fn();
});
afterAll(() => {
  console.error = erroOriginal;
});
afterEach(cleanup);

describe("LimiteDeErro", () => {
  it("fora de erro, entrega o filho intacto", () => {
    render(
      <LimiteDeErro>
        <Quebra deve={false} />
      </LimiteDeErro>,
    );
    expect(screen.getByTestId("filho")).toBeTruthy();
  });

  it("filho que quebra vira nada, em silencio (padrao)", () => {
    render(
      <LimiteDeErro>
        <Quebra deve />
      </LimiteDeErro>,
    );
    expect(screen.queryByTestId("filho")).toBeNull();
  });

  it("o resto da arvore continua de pe: e o ponto de existir", () => {
    render(
      <div>
        <span data-testid="vizinho">continuo aqui</span>
        <LimiteDeErro>
          <Quebra deve />
        </LimiteDeErro>
      </div>,
    );
    expect(screen.getByTestId("vizinho")).toBeTruthy();
  });

  it("usa o fallback quando tem um", () => {
    render(
      <LimiteDeErro fallback={<span data-testid="reserva">reserva</span>}>
        <Quebra deve />
      </LimiteDeErro>,
    );
    expect(screen.getByTestId("reserva")).toBeTruthy();
  });

  it("avisa quem esta de fora, com o erro", () => {
    const aoFalhar = vi.fn();
    render(
      <LimiteDeErro aoFalhar={aoFalhar}>
        <Quebra deve />
      </LimiteDeErro>,
    );
    expect(aoFalhar).toHaveBeenCalledOnce();
    expect(aoFalhar.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
