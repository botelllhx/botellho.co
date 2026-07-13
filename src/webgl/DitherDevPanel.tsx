import { useEffect } from "react";
import { useControls } from "leva";
import { DITHER_DEFAULTS } from "./ditherDefaults";
import type { PhosphorDitherEffect } from "./PhosphorDitherEffect";

// Painel de calibracao ao vivo, so em desenvolvimento (lazy; fora do bundle
// de producao). Ajustar aqui, escolher com o olho, travar em ditherDefaults.
const DitherDevPanel = ({ effect }: { effect: PhosphorDitherEffect }) => {
  const values = useControls("dither", {
    pixelSize: { value: DITHER_DEFAULTS.pixelSize, min: 1, max: 12, step: 1 },
    ditherStrength: { value: DITHER_DEFAULTS.ditherStrength, min: 0, max: 1, step: 0.01 },
    useBayer8: DITHER_DEFAULTS.useBayer8,
    crt: { value: DITHER_DEFAULTS.crt, min: 0, max: 1, step: 0.05 },
  });

  useEffect(() => {
    effect.set(values);
  }, [effect, values]);

  return null;
};

export default DitherDevPanel;
