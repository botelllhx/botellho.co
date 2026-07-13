import { ReactNode, Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PhosphorEffect } from "./PhosphorEffect";
import { SIGNATURE_DEFAULTS } from "./signatureDefaults";
import { prefersReducedMotion } from "@/motion/prefs";

// Painel leva so em dev; em producao o branch morre no build.
const DevPanel = import.meta.env.DEV ? lazy(() => import("./SignatureDevPanel")) : null;

interface SignatureCanvasProps {
  children: ReactNode;
  className?: string;
  camera?: { fov: number; position: [number, number, number] };
  /** fallback estatico para reduced-motion e aparelho fraco */
  fallback?: ReactNode;
}

// Orcamento da assinatura (Secoes 3.5 e 8): lazy por viewport, loop pausado
// fora de tela, dpr clampado, fallback estatico dithered.
const prefersStatic = () => {
  if (prefersReducedMotion()) return true;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory;
  return coarse && memory !== undefined && memory <= 4;
};

const SignatureCanvas = ({
  children,
  className,
  camera = { fov: 38, position: [0, 0, 21] },
  fallback,
}: SignatureCanvasProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"idle" | "live" | "static">("idle");
  const [inView, setInView] = useState(true);
  const effect = useMemo(() => new PhosphorEffect(SIGNATURE_DEFAULTS), []);

  useEffect(() => {
    if (prefersStatic()) {
      setMode("static");
      return;
    }
    const host = hostRef.current;
    if (!host) return;
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
          camera={{ fov: camera.fov, near: 0.1, far: 260, position: camera.position }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          {children}
          <EffectComposer>
            <primitive object={effect} />
            <Bloom
              intensity={SIGNATURE_DEFAULTS.bloom}
              luminanceThreshold={0.4}
              mipmapBlur
            />
          </EffectComposer>
          {DevPanel ? (
            <Suspense fallback={null}>
              <DevPanel effect={effect} />
            </Suspense>
          ) : null}
        </Canvas>
      ) : null}
    </div>
  );
};

export default SignatureCanvas;
