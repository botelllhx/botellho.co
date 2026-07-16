import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// O contato falha calado de um jeito perigoso: sem credenciais ele SIMULA
// sucesso ("Projeto enviado"). Se o .env de producao quebrar, a pessoa ve
// sucesso e a mensagem nunca chega. Estes testes travam o contrato.
const enviarMock = vi.fn();
const toastOk = vi.fn();
const toastErro = vi.fn();

vi.mock("@emailjs/browser", () => ({
  default: { send: (...a: unknown[]) => enviarMock(...a) },
}));
vi.mock("sonner", () => ({
  toast: { success: (m: string) => toastOk(m), error: (m: string) => toastErro(m) },
}));

const dados = {
  name: "Mateus",
  email: "mateus@exemplo.com",
  project: "experiencia-3d",
  message: "quero um diorama",
};

const comCredenciais = () => {
  vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_real");
  vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_real");
  vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "chave_real");
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});
afterEach(() => vi.unstubAllEnvs());

const usar = async () => {
  const { useContactForm } = await import("./useContactForm");
  return renderHook(() => useContactForm());
};

describe("useContactForm", () => {
  it("sem credenciais, NAO chama o EmailJS (modo simulacao)", async () => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "");
    const { result } = await usar();
    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.sendEmail(dados, "token");
    });
    expect(enviarMock).not.toHaveBeenCalled();
    expect(ok).toBe(true);
    // o aviso de simulacao precisa estar na mensagem: sem isso ninguem percebe
    // que o envio nao aconteceu
    expect(toastOk.mock.calls[0]?.[0]).toMatch(/simula/i);
  });

  it("com placeholder do .env.example, tambem simula", async () => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "seu_service_id");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "seu_template_id");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "sua_public_key");
    const { result } = await usar();
    await act(async () => {
      await result.current.sendEmail(dados, null);
    });
    expect(enviarMock).not.toHaveBeenCalled();
    expect(toastOk.mock.calls[0]?.[0]).toMatch(/simula/i);
  });

  it("com credenciais, envia os campos e o token do captcha", async () => {
    comCredenciais();
    enviarMock.mockResolvedValue({ status: 200 });
    const { result } = await usar();
    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.sendEmail(dados, "token-abc");
    });

    expect(ok).toBe(true);
    const [servico, template, payload, chave] = enviarMock.mock.calls[0];
    expect(servico).toBe("service_real");
    expect(template).toBe("template_real");
    expect(chave).toBe("chave_real");
    expect(payload).toMatchObject({
      from_name: "Mateus",
      from_email: "mateus@exemplo.com",
      project_type: "experiencia-3d",
      message: "quero um diorama",
      "g-recaptcha-response": "token-abc",
    });
    expect(toastOk.mock.calls[0]?.[0]).not.toMatch(/simula/i);
  });

  it("sem token, manda o campo do captcha vazio (nao undefined)", async () => {
    comCredenciais();
    enviarMock.mockResolvedValue({ status: 200 });
    const { result } = await usar();
    await act(async () => {
      await result.current.sendEmail(dados, null);
    });
    expect(enviarMock.mock.calls[0][2]["g-recaptcha-response"]).toBe("");
  });

  it("falha no envio devolve false e avisa a pessoa", async () => {
    comCredenciais();
    enviarMock.mockRejectedValue(new Error("rede caiu"));
    const { result } = await usar();
    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.sendEmail(dados, "t");
    });
    expect(ok).toBe(false);
    expect(toastOk).not.toHaveBeenCalled();
    expect(toastErro).toHaveBeenCalled();
  });

  it("erro de reCAPTCHA ganha mensagem propria (o generico nao ajudaria)", async () => {
    comCredenciais();
    enviarMock.mockRejectedValue({ text: "invalid reCAPTCHA token" });
    const { result } = await usar();
    await act(async () => {
      await result.current.sendEmail(dados, "t");
    });
    expect(toastErro.mock.calls[0]?.[0]).toMatch(/reCAPTCHA/i);
  });

  it("loading volta pra false depois do envio", async () => {
    comCredenciais();
    enviarMock.mockResolvedValue({ status: 200 });
    const { result } = await usar();
    await act(async () => {
      await result.current.sendEmail(dados, "t");
    });
    expect(result.current.loading).toBe(false);
  });
});
