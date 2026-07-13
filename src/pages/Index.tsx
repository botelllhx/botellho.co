import { useState } from "react";
import { Head } from "vite-react-ssg";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Head>
        <title>botellho | Estúdio de web e experiências digitais</title>
        <meta
          name="description"
          content="Estúdio brasileiro de web e experiências digitais para instituições culturais e marcas que querem ser lembradas. Craft de nível de prêmio, WebGL e domínio real do setor cultural."
        />
        <link rel="canonical" href="https://botellho.com/" />
        <meta property="og:title" content="botellho | Estúdio de web e experiências digitais" />
        <meta
          property="og:description"
          content="Estúdio brasileiro de web e experiências digitais para instituições culturais e marcas que querem ser lembradas."
        />
        <meta property="og:url" content="https://botellho.com/" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
        <meta name="twitter:title" content="botellho | Estúdio de web e experiências digitais" />
        <meta
          name="twitter:description"
          content="Estúdio brasileiro de web e experiências digitais para instituições culturais e marcas que querem ser lembradas."
        />
        <meta name="twitter:image" content="https://botellho.com/og-image.jpg" />
      </Head>

      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      <div className={`relative min-h-screen bg-background ${isLoading ? "overflow-hidden h-screen" : ""}`}>
        <Navbar />
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
