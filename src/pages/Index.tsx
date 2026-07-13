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
          content="Web que se move: sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições. Estúdio brasileiro de web e experiências digitais."
        />
        <link rel="canonical" href="https://botellho.com/" />
        <meta property="og:title" content="botellho | Estúdio de web e experiências digitais" />
        <meta
          property="og:description"
          content="Sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições."
        />
        <meta property="og:url" content="https://botellho.com/" />
        <meta property="og:image" content="https://botellho.com/og-image.jpg" />
        <meta name="twitter:title" content="botellho | Estúdio de web e experiências digitais" />
        <meta
          name="twitter:description"
          content="Sites, experiências 3D e WebGL com craft de nível de prêmio, para marcas, cultura e instituições."
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
