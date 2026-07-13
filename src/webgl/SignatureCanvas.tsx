import { ReactNode, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import DitherComposer from "./DitherComposer";

interface SignatureCanvasProps {
  children: ReactNode;
  className?: string;
  /** fallback estatico para reduced-motion e aparelhos fracos */
  fallback?: ReactNode;
}

// Orcamento de performance da assinatura (Secao 3.5 / 8):
// - so monta quando se aproxima da viewport (lazy)
// - pausa o loop quando sai de tela
// - dpr clampado; o downscale do dither ja ajuda o custo
// - reduced-motion e aparelho fraco recebem o fallback estatico
const prefersStatic = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory;
  return coarse && memory !== undefined && memory <= 4;
};

const SignatureCanvas = ({ children, className, fallback }: SignatureCanvasProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"idle" | "live" | "static">("idle");
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (prefersStatic()) {
      setMode("static");
      return;
    }
    const host = hostRef.current;
    if (!host) return;

    // Monta o canvas quando o hero se aproxima; pausa o loop fora de tela
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMode("live");
        setInView(entry.isIntersecting);
      },
      { rootMargin: "200px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      {mode === "static" ? (
        fallback ?? null
      ) : mode === "live" ? (
        <Canvas
          dpr={[1, 1.5]}
          frameloop={inView ? "always" : "never"}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          camera={{ fov: 38, near: 0.1, far: 220, position: [0, 0, 21] }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          {children}
          <DitherComposer />
        </Canvas>
      ) : null}
    </div>
  );
};

export default SignatureCanvas;
