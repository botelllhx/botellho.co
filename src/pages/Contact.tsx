import { FormEvent, useRef, useState } from "react";
import { Head } from "vite-react-ssg";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import Typing from "@/motion/Typing";
import LineReveal from "@/motion/LineReveal";
import { useContactForm } from "@/hooks/useContactForm";

// O prompt: o formulario de contato e uma sessao de terminal, com
// qualificacao por tipo de projeto, setor e faixa de orcamento.
const TIPOS = [
  ["institucional", "site institucional"],
  ["experiencia-3d", "experiência 3D"],
  ["acervo", "acervo e patrimônio"],
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
  "w-full border-b border-foreground/20 bg-transparent px-0 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-phosphor focus:outline-none transition-colors";

const Contact = () => {
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
      const success = await sendEmail(payload, null);
      if (success) reset();
      return;
    }

    try {
      // @ts-expect-error executeAsync existe no componente, tipos desatualizados
      const token = await recaptchaRef.current?.executeAsync();
      if (!token) {
        toast.error("Não foi possível validar o reCAPTCHA.");
        return;
      }
      const success = await sendEmail(payload, token);
      if (success) {
        reset();
        recaptchaRef.current?.reset();
      }
    } catch {
      toast.error("Erro ao validar o reCAPTCHA. Recarregue a página.");
    }
  };

  return (
    <>
      <Head>
        <title>Contato | botellho</title>
        <meta
          name="description"
          content="Comece um projeto com o botellho: site institucional, experiência 3D, acervo digital ou parceria white-label. Conte o que você quer construir."
        />
        <link rel="canonical" href="https://botellho.com/contact" />
        <meta property="og:title" content="Contato | botellho" />
        <meta
          property="og:description"
          content="Conte o que você quer construir. Quanto mais específico, melhor a nossa resposta."
        />
        <meta property="og:url" content="https://botellho.com/contact" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      <section className="px-4 pt-16 md:px-6 md:pt-24">
        <Typing text="> nova sessão de contato" className="type-label text-muted-foreground" />
        <LineReveal as="h1" className="type-tese mt-8 max-w-4xl">
          Conte o que você quer construir.
        </LineReveal>
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
          Institucional, experiência 3D, acervo ou parceria de desenvolvimento:
          quanto mais específico, melhor a nossa resposta.
        </p>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-3xl border border-foreground/20">
          <div className="flex items-center justify-between border-b border-foreground/20 px-4 py-2">
            <span className="type-label text-muted-foreground">sessão de contato · botellho</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-5 md:p-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <label htmlFor="nome" className="type-label block text-muted-foreground">
                  &gt; nome:
                </label>
                <input
                  id="nome"
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  placeholder="como te chamamos"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="type-label block text-muted-foreground">
                  &gt; email:
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  placeholder="voce@dominio.com"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <label htmlFor="tipo" className="type-label block text-muted-foreground">
                  &gt; tipo de projeto:
                </label>
                <select
                  id="tipo"
                  value={form.tipo}
                  onChange={(e) => set("tipo")(e.target.value)}
                  className={fieldClass}
                >
                  <option value="">selecionar</option>
                  {TIPOS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="setor" className="type-label block text-muted-foreground">
                  &gt; setor:
                </label>
                <select
                  id="setor"
                  value={form.setor}
                  onChange={(e) => set("setor")(e.target.value)}
                  className={fieldClass}
                >
                  <option value="">selecionar</option>
                  {SETORES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="faixa" className="type-label block text-muted-foreground">
                  &gt; faixa de orçamento:
                </label>
                <select
                  id="faixa"
                  value={form.faixa}
                  onChange={(e) => set("faixa")(e.target.value)}
                  className={fieldClass}
                >
                  <option value="">selecionar</option>
                  {FAIXAS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="mensagem" className="type-label block text-muted-foreground">
                &gt; mensagem:
              </label>
              <textarea
                id="mensagem"
                rows={5}
                value={form.message}
                onChange={(e) => set("message")(e.target.value)}
                placeholder="contexto, prazos, referências"
                className={`${fieldClass} resize-none`}
              />
            </div>

            <button type="submit" disabled={loading} className="cmd-button disabled:opacity-50">
              {loading ? "Enviando..." : "Enviar projeto"}
            </button>

            {recaptchaSiteKey ? (
              <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={recaptchaSiteKey} />
            ) : null}
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
