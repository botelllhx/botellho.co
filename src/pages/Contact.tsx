import { Head } from "vite-react-ssg";
import Typing from "@/motion/Typing";
import LineReveal from "@/motion/LineReveal";
import ContactForm from "@/system/ContactForm";

// /contato (arquetipo D): um programa de contato enquadrado como terminal.
const Contact = () => {
  return (
    <>
      <Head>
        <title>Contato | botellho</title>
        <meta
          name="description"
          content="Comece um projeto com o botellho: site institucional, experiência 3D, marca, evento ou parceria white-label. Conte o que você quer construir."
        />
        <link rel="canonical" href="https://botellho.com/contato" />
        <meta property="og:title" content="Contato | botellho" />
        <meta property="og:description" content="Conte o que você quer construir. Quanto mais específico, melhor a nossa resposta." />
        <meta property="og:url" content="https://botellho.com/contato" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      <section className="px-4 pt-16 md:px-6 md:pt-24">
        <Typing text="> vamos conversar sobre seu projeto" className="type-label text-muted-foreground" />
        <LineReveal as="h1" className="type-tese mt-8 max-w-4xl">Conte o que você quer construir.</LineReveal>
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
          Institucional, experiência 3D, marca, evento ou parceria de
          desenvolvimento: quanto mais específico, melhor a nossa resposta.
        </p>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-3xl border border-foreground/20">
          <div className="flex items-center justify-between border-b border-foreground/20 px-4 py-2">
            <span className="type-dos text-xs text-phosphor">contato.exe</span>
            <span className="type-label text-muted-foreground">sessão · botellho</span>
          </div>
          <div className="p-5 md:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
