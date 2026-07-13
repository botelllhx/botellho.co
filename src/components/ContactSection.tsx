import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mail, Phone, MapPin, Send, ArrowUpRight } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

import { useContactForm } from "@/hooks/useContactForm";
import { toast } from "sonner";

const ContactSection = () => {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.1 });
  const { sendEmail, loading } = useContactForm();
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked", formData);

    if (!formData.name || !formData.email || !formData.message) {
      toast.warning("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // If reCAPTCHA key is not configured, fallback to send without token.
    if (!recaptchaSiteKey) {
      toast.warning("reCAPTCHA nao configurado. Envio em modo degradado.");
      const success = await sendEmail(formData, null);
      if (success) {
        setFormData({ name: "", email: "", project: "", message: "" });
      }
      return;
    }

    // Executa o reCAPTCHA Invisible e aguarda o token (Promise)
    if (recaptchaRef.current) {
      try {
        console.log("Executing reCAPTCHA (Async)...");
        // @ts-expect-error executeAsync existe no componente, mas os tipos podem estar desatualizados
        const token = await recaptchaRef.current.executeAsync();
        console.log("Token received:", token);

        if (token) {
          const success = await sendEmail(formData, token);
          if (success) {
            setFormData({ name: "", email: "", project: "", message: "" });
            recaptchaRef.current.reset();
          }
        } else {
          toast.error("Não foi possível obter o token do reCAPTCHA.");
        }
      } catch (err) {
        console.error("ReCAPTCHA Execution Error:", err);
        toast.error("Erro ao executar reCAPTCHA. Verifique o console.");
      }
    } else {
      console.error("reCAPTCHA ref is null");
      toast.error("Erro interno no reCAPTCHA. Tente recarregar a página.");
    }
  };

  const onCaptchaErrored = () => {
    console.error("ReCAPTCHA Errored Event triggered");
    toast.error("O Google reCAPTCHA encontrou um erro. Verifique sua conexão ou chaves.");
  };

  const contacts = [
    { icon: Mail, label: "Email", value: "contato@botellho.com", href: "mailto:contato@botellho.com" },
    { icon: Phone, label: "WhatsApp", value: "+55 31 99388-4747", href: "https://wa.me/5531993884747" },
    { icon: MapPin, label: "Localização", value: "Belo Horizonte, MG", href: "#" },
  ];

  return (
    <section
      ref={ref}
      id="contato"
      className="relative overflow-hidden bg-foreground py-32 md:py-48"
    >
      {/* Section Label */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container px-6 mb-16"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-background/60">
          (Entre em contato)
        </span>
      </motion.div>

      {/* Main Title */}
      <div className="container px-6 mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-huge font-display font-bold text-background"
        >
          Vamos criar
          <br />
          <span className="text-primary">algo incrível</span>
          <span className="text-background">?</span>
        </motion.h2>
      </div>

      {/* Content Grid */}
      <div className="container px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <p className="font-sans text-xl leading-relaxed text-background/70">
              Conte o que você quer construir. Institucional, experiência 3D,
              acervo ou uma parceria de desenvolvimento: quanto mais específico,
              melhor a nossa resposta.
            </p>

            {/* Contact Links */}
            <div className="space-y-4">
              {contacts.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <motion.a
                    key={index}
                    href={contact.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="group flex items-center gap-6 py-4 border-b border-background/10 transition-colors hover:border-primary"
                  >
                    <Icon className="h-5 w-5 text-background/50" />
                    <div className="flex-1">
                      <span className="block font-mono text-xs uppercase tracking-widest text-background/40">
                        {contact.label}
                      </span>
                      <span className="block font-sans text-lg text-background">
                        {contact.value}
                      </span>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-background/30 transition-all group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </motion.a>
                );
              })}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-8"
            >
              <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-background/40">
                Redes Sociais
              </span>
              <div className="flex gap-4">
                {["Instagram", "LinkedIn", "Behance"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="font-mono text-sm text-background/60 transition-colors hover:text-primary"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-background/40">
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-transparent border-b-2 border-background/20 px-0 py-4 font-sans text-background placeholder:text-background/30 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Como podemos te chamar?"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-background/40">
                  Seu Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-transparent border-b-2 border-background/20 px-0 py-4 font-sans text-background placeholder:text-background/30 focus:border-primary focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-background/40">
                Tipo de Projeto
              </label>
              <select
                value={formData.project}
                onChange={(e) =>
                  setFormData({ ...formData, project: e.target.value })
                }
                className="w-full bg-transparent border-b-2 border-background/20 px-0 py-4 font-sans text-background focus:border-primary focus:outline-none transition-colors"
              >
                <option value="" className="bg-foreground">Selecione uma opção</option>
                <option value="institucional" className="bg-foreground">Site institucional</option>
                <option value="experiencia-3d" className="bg-foreground">Experiência 3D</option>
                <option value="acervo" className="bg-foreground">Acervo e patrimônio</option>
                <option value="white-label" className="bg-foreground">Parceria white-label</option>
                <option value="outro" className="bg-foreground">Outro</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-background/40">
                Sua Mensagem
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                className="w-full resize-none bg-transparent border-b-2 border-background/20 px-0 py-4 font-sans text-background placeholder:text-background/30 focus:border-primary focus:outline-none transition-colors"
                placeholder="Conte-nos sobre seu projeto..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-8 inline-flex items-center gap-3 bg-primary px-8 py-4 font-mono text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-background hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar projeto"}
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* ReCAPTCHA v2 Invisible */}
            {recaptchaSiteKey ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={recaptchaSiteKey}
                onChange={() => { }} // Not used with executeAsync
                onErrored={onCaptchaErrored}
                theme="dark"
              />
            ) : null}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
