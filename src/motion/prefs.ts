// Preferencias de motion (Secao 5.10): tudo que anima consulta isto.
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
