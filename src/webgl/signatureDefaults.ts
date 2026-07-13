// Valores travados da assinatura (Secao 9: calibrar via leva em dev,
// decidir com o olho, travar aqui).
export const SIGNATURE_DEFAULTS = {
  pixelSize: 3,
  ditherStrength: 0.34,
  useBayer8: false,
  crt: 0.3,
  bloom: 0.22,
};

export type SignatureParams = typeof SIGNATURE_DEFAULTS;
