import { FormEvent, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { useContactForm } from "@/hooks/useContactForm";

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

const ContactForm = () => {
  const { sendEmail, loading } = useContactForm();
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const recaptchaRef = useRef<ReCAPTCHA>(null);

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
    try {
      // @ts-expect-error executeAsync existe no componente, tipos desatualizados
      const token = await recaptchaRef.current?.executeAsync();
      if (!token) {
        toast.error("Não foi possível validar o reCAPTCHA.");
        return;
      }
      const ok = await sendEmail(payload, token);
      if (ok) {
        reset();
        recaptchaRef.current?.reset();
      }
    } catch {
      toast.error("Erro ao validar o reCAPTCHA. Recarregue a página.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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

      {recaptchaSiteKey ? (
        <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={recaptchaSiteKey} />
      ) : null}
    </form>
  );
};

export default ContactForm;
