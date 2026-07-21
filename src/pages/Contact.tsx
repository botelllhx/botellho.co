import { Head } from "vite-react-ssg";
import Typing from "@/motion/Typing";
import Scramble from "@/motion/Scramble";
import Window from "@/system/Window";
import RetroDesktop from "@/system/RetroDesktop";
import ContactForm from "@/system/ContactForm";

// /contato: mesmo ambiente de desktop retro da home, precedido por um titulo.
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

      {/* ===== Titulo (branco), full width ===== */}
      <section className="bg-background px-4 pb-16 pt-16 md:px-6 md:pb-24 md:pt-24">
        <Typing text="> vamos conversar sobre seu projeto" className="type-label text-muted-foreground" />
        <Scramble as="h1" text="Conte o que você quer construir." className="mt-8 block font-display leading-[0.9] tracking-[-0.03em] text-[clamp(2.5rem,8.5vw,9rem)]" />
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
          Institucional, experiência 3D, marca, evento ou parceria de
          desenvolvimento: quanto mais específico, melhor a minha resposta.
        </p>
      </section>

      {/* ===== Desktop retro com a janela arrastavel (igual a home) ===== */}
      <section className="bg-phosphor px-4 py-16 text-paper md:px-6 md:py-24">
        <RetroDesktop>
          <Window title="começar_um_projeto.exe" phosphor draggable bounded className="w-full max-w-2xl text-foreground">
            <p className="mb-8 font-sans text-base text-muted-foreground">
              Conte o que você quer construir. Quanto mais específico, melhor a
              nossa resposta. Arraste a janela pela barra se quiser.
            </p>
            <ContactForm />
          </Window>
        </RetroDesktop>
      </section>
    </>
  );
};

export default Contact;
