import { Head } from "vite-react-ssg";
import Typing from "@/motion/Typing";
import Scramble from "@/motion/Scramble";
import Window from "@/system/Window";
import ContactForm from "@/system/ContactForm";

// /contato: um programa de contato enquadrado como janela retro.
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

      <section className="bg-background px-4 pt-16 md:px-6 md:pt-24">
        <Typing text="> vamos conversar sobre seu projeto" className="type-label text-muted-foreground" />
        <Scramble as="h1" text="Conte o que você quer construir." className="type-tese mt-8 max-w-4xl" />
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
          Institucional, experiência 3D, marca, evento ou parceria de
          desenvolvimento: quanto mais específico, melhor a nossa resposta.
        </p>
      </section>

      <section className="bg-phosphor px-4 py-16 text-paper md:px-6 md:py-24">
        <Window title="contato.exe" phosphor draggable={false} className="mx-auto max-w-3xl text-foreground">
          <ContactForm />
        </Window>
      </section>
    </>
  );
};

export default Contact;
