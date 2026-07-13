// Valores travados da assinatura (Secao 4 da direcao: bitmap pixel-6, bloco,
// nao ruido; dither so em imagem estatica). Calibrar via leva em dev.
export const SIGNATURE_DEFAULTS = {
  pixelSize: 6,
  useDither: false,
  ditherStrength: 0.34,
  useBayer8: false,
  crt: 0.3,
  bloom: 0.18,
};

export type SignatureParams = typeof SIGNATURE_DEFAULTS;
