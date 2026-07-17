import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { forwardRef } from "react";

// Este arquivo existe por causa de um bug de PRODUCAO: o reCAPTCHA (widget
// invisivel, opcional, que so serve no envio) montava junto com a pagina. Quando
// o chunk dele nao chegava, o import() virava erro de render, subia ate o React
// Router e trocava A PAGINA INTEIRA pela tela crua "Unexpected Application
// Error!". O Google rastreou isso e marcou a home e o /contato como soft 404.
//
// Nao da pra reproduzir isso no navegador do painel (aba de fundo, e a falha
// depende de rede), entao a regra fica travada aqui.
const mock = vi.hoisted(() => ({ falhar: false, tentativas: 0 }));

vi.mock("react-google-recaptcha", () => {
  mock.tentativas += 1;
  return {
    // O React.lazy transforma a rejeicao do import() num throw durante o RENDER,
    // e e exatamente ai que o boundary age. Entao jogar o throw no render e fiel
    // ao mecanismo real, e ainda evita depender do cache de modulo do vitest (que
    // guarda o modulo mockado entre os testes e nao deixa a fabrica rodar de novo).
    default: forwardRef<HTMLDivElement>(() => {
      if (mock.falhar) {
        throw new Error("Failed to fetch dynamically imported module: /assets/index-Bvp4thND.js");
      }
      return <div data-testid="captcha" />;
    }),
  };
});

const enviar = vi.fn();
vi.mock("@emailjs/browser", () => ({ default: { send: (...a: unknown[]) => enviar(...a) } }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }));

const montar = async () => {
  const ContactForm = (await import("./ContactForm")).default;
  return render(<ContactForm />);
};

beforeEach(() => {
  vi.resetModules();
  mock.falhar = false;
  mock.tentativas = 0;
  vi.stubEnv("VITE_RECAPTCHA_SITE_KEY", "chave-de-teste");
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("ContactForm e o reCAPTCHA", () => {
  it("NAO carrega o captcha antes de a pessoa mexer no formulario", async () => {
    await montar();
    // e isto que tira o crawler da rota do problema: quem so olha a pagina nunca
    // dispara o import, entao nao ha o que falhar
    expect(mock.tentativas).toBe(0);
    expect(screen.queryByTestId("captcha")).toBeNull();
  });

  it("carrega no primeiro foco de um campo", async () => {
    await montar();
    fireEvent.focus(screen.getByPlaceholderText("como te chamamos"));
    await waitFor(() => expect(screen.queryByTestId("captcha")).not.toBeNull());
    expect(mock.tentativas).toBe(1);
  });

  it("captcha que falha nao derruba o formulario: a pagina continua inteira", async () => {
    mock.falhar = true;
    await montar();
    fireEvent.focus(screen.getByPlaceholderText("como te chamamos"));

    // o boundary segura o erro. Sem ele, isto virava a tela crua do React Router
    // no lugar da pagina, e era o que o Google via.
    await waitFor(() => expect(screen.queryByTestId("captcha")).toBeNull());
    expect(screen.getByPlaceholderText("como te chamamos")).toBeTruthy();
    expect(screen.getByPlaceholderText("voce@dominio.com")).toBeTruthy();
    expect(screen.getByPlaceholderText("contexto, prazos, referências")).toBeTruthy();
    expect(screen.getByRole("button", { name: /enviar projeto/i })).toBeTruthy();
  });

  it("o formulario segue utilizavel depois da falha: da pra digitar", async () => {
    mock.falhar = true;
    await montar();
    const nome = screen.getByPlaceholderText("como te chamamos") as HTMLInputElement;
    fireEvent.focus(nome);
    await waitFor(() => expect(screen.queryByTestId("captcha")).toBeNull());

    fireEvent.change(nome, { target: { value: "Mateus" } });
    expect(nome.value).toBe("Mateus");
  });

  it("sem chave configurada, o captcha nem entra em cena", async () => {
    vi.stubEnv("VITE_RECAPTCHA_SITE_KEY", "");
    await montar();
    fireEvent.focus(screen.getByPlaceholderText("como te chamamos"));
    expect(screen.queryByTestId("captcha")).toBeNull();
  });
});
