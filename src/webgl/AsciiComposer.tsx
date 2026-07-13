import { useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { EffectComposer, RenderPass, EffectPass } from "postprocessing";
import { AsciiGlyphEffect } from "./AsciiGlyphEffect";
import { buildGlyphAtlas } from "./glyphAtlas";

const AsciiComposer = () => {
  const { gl, scene, camera, size } = useThree();
  const [composer, setComposer] = useState<EffectComposer | null>(null);

  // O atlas depende da fonte IBM VGA carregada; monta o composer quando pronto
  useEffect(() => {
    let cancelled = false;
    let instance: EffectComposer | null = null;

    buildGlyphAtlas().then(({ texture, glyphCount }) => {
      if (cancelled) {
        texture.dispose();
        return;
      }
      const effect = new AsciiGlyphEffect({ atlas: texture, glyphCount });
      instance = new EffectComposer(gl);
      instance.addPass(new RenderPass(scene, camera));
      instance.addPass(new EffectPass(camera, effect));
      setComposer(instance);
    });

    return () => {
      cancelled = true;
      instance?.dispose();
    };
  }, [gl, scene, camera]);

  useEffect(() => {
    composer?.setSize(size.width, size.height, false);
  }, [composer, size]);

  useFrame((_, delta) => {
    composer?.render(delta);
  }, 1);

  return null;
};

export default AsciiComposer;
