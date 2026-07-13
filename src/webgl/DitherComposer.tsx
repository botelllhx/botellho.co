import { Suspense, lazy, useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { EffectComposer, RenderPass, EffectPass } from "postprocessing";
import { PhosphorDitherEffect } from "./PhosphorDitherEffect";
import { DITHER_DEFAULTS } from "./ditherDefaults";

// Painel leva apenas em dev; em producao o branch morre no build e o chunk
// nem e gerado.
const DevPanel = import.meta.env.DEV
  ? lazy(() => import("./DitherDevPanel"))
  : null;

const DitherComposer = () => {
  const { gl, scene, camera, size } = useThree();

  const { composer, effect } = useMemo(() => {
    const effect = new PhosphorDitherEffect(DITHER_DEFAULTS);
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new EffectPass(camera, effect));
    return { composer, effect };
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.setSize(size.width, size.height, false);
  }, [composer, size]);

  useEffect(() => {
    return () => {
      composer.dispose();
    };
  }, [composer]);

  // Assume o render loop do fiber (prioridade > 0 desliga o render padrao)
  useFrame((_, delta) => {
    composer.render(delta);
  }, 1);

  return DevPanel ? (
    <Suspense fallback={null}>
      <DevPanel effect={effect} />
    </Suspense>
  ) : null;
};

export default DitherComposer;
