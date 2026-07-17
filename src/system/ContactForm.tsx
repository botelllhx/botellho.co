import { FormEvent, Suspense, lazy, useRef, useState } from "react";
import type ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { useContactForm } from "@/hooks/useContactForm";
import LimiteDeErro from "@/system/LimiteDeErro";

// Formulario de contato como sessao de terminal, compartilhado entre a home
// (secao embutida) e a pagina /contato. Qualificacao por tipo, setor e faixa.
const TIPOS = [
  ["institucional", "site institucional"],
  ["experiencia-3d", "experiência 3D"],
  ["marca", "marca e produto"],
  ["evento", "evento e lançamento"],
  ["white-label", "parceria white-label"],
  ["outro", "outro"],
] as const;

const SETORES = [
  ["cultura", "cultura e instituições"],
  ["marca", "marca e produto"],
  ["evento", "evento e lançamento"],
  ["educacao", "educação"],
  ["outro", "outro"],
] as const;

const FAIXAS = [
  ["ate-10k", "até R$ 10 mil"],
  ["10k-30k", "R$ 10 a 30 mil"],
  ["30k-60k", "R$ 30 a 60 mil"],
  ["acima-60k", "acima de R$ 60 mil"],
  ["nao-sei", "ainda não sei"],
] as const;

const fieldClass =
  "w-full border-b border-foreground/25 bg-transparent px-0 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-phosphor focus:outline-none transition-colors";

// O react-google-recaptcha e CommonJS: no SSR o default do interop vem como
// objeto de modulo, nao componente, e o pre-render de /contato morre com
// "Element type is invalid... but got: object". Isso so aparecia com a chave
// presente (ou seja, so no CI). Como o widget precisa de window pra existir,
// ele e carregado no cliente.
const ReCaptchaLazy = lazy(() => import("react-google-recaptcha"));

const CONTATO = "contato@botellho.com";

const ContactForm = () => {
  const { sendEmail, loading } = useContactForm();
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // O widget so monta quando a pessoa mexe no formulario de verdade. Antes ele
  // montava junto com a pagina, entao TODO visitante da home baixava o chunk e o
  // script do Google sem nunca enviar nada. Quem nunca interage (o crawler, e a
  // maioria das visitas) nem tenta carregar: some a causa do soft 404, e ainda
  // sobra uma requisicao a menos e menos rastreio de terceiro.
  // Comeca false no servidor e no cliente, entao a hidratacao casa.
  const [querCaptcha, setQuerCaptcha] = useState(false);
  const [captchaFalhou, setCaptchaFalhou] = useState(false);
  const acordarCaptcha = () => setQuerCaptcha(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    tipo: "",
    setor: "",
    faixa: "",
    message: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // O widget so comeca a baixar no primeiro foco, entao num preenchimento
  // relampago ele pode nao estar pronto no envio: espera um pouco em vez de
  // acusar erro na cara da pessoa.
  const esperarCaptcha = async (ms = 4000) => {
    const ate = Date.now() + ms;
    while (!recaptchaRef.current && Date.now() < ate) {
      await new Promise((r) => setTimeout(r, 80));
    }
    return recaptchaRef.current;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    acordarCaptcha();
    if (!form.name || !form.email || !form.message) {
      toast.warning("Preencha nome, email e mensagem.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      project: form.tipo || "nao informado",
      message: `setor: ${form.setor || "não informado"} · orçamento: ${form.faixa || "não informado"}\n\n${form.message}`,
    };
    const reset = () =>
      setForm({ name: "", email: "", tipo: "", setor: "", faixa: "", message: "" });

    if (!recaptchaSiteKey) {
      const ok = await sendEmail(payload, null);
      if (ok) reset();
      return;
    }
    // Se o widget nao carregou (bloqueador, rede, renderizador que desistiu), o
    // formulario segue de pe: a pessoa recebe uma saida real em vez de uma tela
    // quebrada ou um botao que nao faz nada.
    const widget = captchaFalhou ? null : await esperarCaptcha();
    if (!widget) {
      toast.error(`Não foi possível carregar a verificação anti-spam. Escreva direto para ${CONTATO}.`);
      return;
    }
    try {
      const token = await widget.executeAsync();
      if (!token) {
        toast.error("Não foi possível validar o reCAPTCHA. Tente enviar de novo.");
        return;
      }
      const ok = await sendEmail(payload, token);
      if (ok) {
        reset();
        widget.reset();
      }
    } catch {
      toast.error(`Erro ao validar o reCAPTCHA. Tente de novo ou escreva para ${CONTATO}.`);
    }
  };

  return (
    // onFocus borbulha no React (usa focusin), entao pegar aqui cobre todos os
    // campos sem pendurar handler em cada um.
    <form onSubmit={handleSubmit} onFocus={acordarCaptcha} className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="type-label block text-muted-foreground">&gt; nome:</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
            placeholder="como te chamamos"
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="type-label block text-muted-foreground">&gt; email:</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            placeholder="voce@dominio.com"
            className={fieldClass}
          />
        </label>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <label className="block">
          <span className="type-label block text-muted-foreground">&gt; tipo de projeto:</span>
          <select value={form.tipo} onChange={(e) => set("tipo")(e.target.value)} className={fieldClass}>
            <option value="">selecionar</option>
            {TIPOS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="type-label block text-muted-foreground">&gt; setor:</span>
          <select value={form.setor} onChange={(e) => set("setor")(e.target.value)} className={fieldClass}>
            <option value="">selecionar</option>
            {SETORES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="type-label block text-muted-foreground">&gt; faixa de orçamento:</span>
          <select value={form.faixa} onChange={(e) => set("faixa")(e.target.value)} className={fieldClass}>
            <option value="">selecionar</option>
            {FAIXAS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="type-label block text-muted-foreground">&gt; mensagem:</span>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => set("message")(e.target.value)}
          placeholder="contexto, prazos, referências"
          className={`${fieldClass} resize-none`}
        />
      </label>

      <button type="submit" disabled={loading} className="cmd-button disabled:opacity-50">
        {loading ? "Enviando..." : "Enviar projeto"}
      </button>

      {/* Widget invisivel, opcional, que so serve no envio. Se o chunk nao vier,
          o boundary devolve null e o formulario continua inteiro: sem ele, o
          erro de render subia ate o React Router e apagava a pagina toda. */}
      {recaptchaSiteKey && querCaptcha ? (
        <LimiteDeErro aoFalhar={() => setCaptchaFalhou(true)}>
          <Suspense fallback={null}>
            <ReCaptchaLazy ref={recaptchaRef} size="invisible" sitekey={recaptchaSiteKey} />
          </Suspense>
        </LimiteDeErro>
      ) : null}
    </form>
  );
};

export default ContactForm;
