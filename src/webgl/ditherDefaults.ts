// Valores travados da assinatura (Secao 9 do brief: calibrar via leva em dev,
// decidir com o olho, e entao travar aqui).
export const DITHER_DEFAULTS = {
  pixelSize: 3,
  ditherStrength: 0.34,
  useBayer8: false,
  crt: 0.35,
};

export type DitherParams = typeof DITHER_DEFAULTS;
