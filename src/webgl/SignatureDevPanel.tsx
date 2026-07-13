import { useEffect } from "react";
import { useControls } from "leva";
import { SIGNATURE_DEFAULTS } from "./signatureDefaults";
import type { PhosphorEffect } from "./PhosphorEffect";

// Calibracao ao vivo (dev only, lazy): ajustar, decidir com o olho e travar
// os valores em signatureDefaults.
const SignatureDevPanel = ({ effect }: { effect: PhosphorEffect | null }) => {
  const values = useControls("assinatura", {
    pixelSize: { value: SIGNATURE_DEFAULTS.pixelSize, min: 1, max: 12, step: 1 },
    ditherStrength: { value: SIGNATURE_DEFAULTS.ditherStrength, min: 0, max: 1, step: 0.01 },
    useBayer8: SIGNATURE_DEFAULTS.useBayer8,
    crt: { value: SIGNATURE_DEFAULTS.crt, min: 0, max: 1, step: 0.05 },
  });

  useEffect(() => {
    effect?.set(values);
  }, [effect, values]);

  return null;
};

export default SignatureDevPanel;
