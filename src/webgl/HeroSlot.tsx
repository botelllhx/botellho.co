import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/motion/prefs";
import { registrarHero } from "@/system/heroPronto";

// Portao do hero 3D. Three + R3F + postprocessing + shaders somam ~1.8MB: se o
// import for direto, isso entra no bundle da pagina que e o LCP e atrasa a
// pintura do texto. Aqui o canvas so e baixado quando:
//   1. a secao entra (ou esta perto de entrar) na viewport, e
//   2. o dispositivo aguenta e a pessoa nao pediu menos movimento.
// Fora disso fica o campo vazio: nao ha imagem de fallback (era um frame estatico
// do diorama que aparecia na hora errada, antes do boot cobrir a tela).
const HeroDiorama = lazy(() => import("./HeroDiorama"));

// Heuristica de dispositivo fraco: pouca RAM ou poucos nucleos. Nao e exata (o
// browser arredonda de proposito), mas erra pro lado seguro: na duvida deixa o
// campo vazio em vez de derrubar o aparelho com um canvas de 3 passes.
const aparelhoFraco = () => {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const ram = nav.deviceMemory ?? 8;
  const cpus = navigator.hardwareConcurrency ?? 8;
  return ram <= 4 || cpus <= 4;
};

interface HeroSlotProps {
  /** repassado pro HeroDiorama: abre a cena focada num alvo (ex.: "Monitor") */
  focoInicial?: string;
  /** trava a camera no foco inicial (a pagina do estudio usa) */
  travado?: boolean;
  /** altura do container. Padrao: a tela abaixo da barra (home) */
  className?: string;
}

const HeroSlot = ({ focoInicial, travado, className }: HeroSlotProps) => {
  const box = useRef<HTMLDivElement>(null);
  const [carregar, setCarregar] = useState(false);
  const [estatico, setEstatico] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || aparelhoFraco()) {
      setEstatico(true);
      return;
    }
    const el = box.current;
    if (!el) return;
    // 300px de folga: comeca a baixar um pouco antes de aparecer, entao no
    // scroll normal o canvas ja esta pronto quando entra em cena.
    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          // avisa o boot que vale a pena esperar: tem 3D vindo
          registrarHero();
          setCarregar(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const altura = className ?? "h-[calc(100svh-var(--bar-h))]";

  return (
    <div ref={box} className={`relative w-full bg-[#b7bbc0] ${altura}`}>
      {carregar && !estatico ? (
        <Suspense fallback={null}>
          <HeroDiorama focoInicial={focoInicial} travado={travado} className="h-full" />
        </Suspense>
      ) : null}
    </div>
  );
};

export default HeroSlot;
