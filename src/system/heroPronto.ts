// Sinal do hero 3D pro boot (ver BootOverlay). O boot contava um tempo fixo e
// subia no meio do download do canvas: a tela abria e o 3D pulava pra dentro
// depois. Agora ele espera este aviso.
//
// E um modulo simples de proposito: um produtor (o hero) avisando um consumidor
// (o boot). Nao vale contexto do React porque os dois vivem em arvores
// diferentes, e o boot ja nasce montado no HTML estatico.

let existe = false;
let pronto = false;
const ouvintes = new Set<() => void>();

/** O hero avisa que o 3D vem: o boot deve esperar por ele em vez de subir. */
export const registrarHero = () => {
  existe = true;
};

/** Tem 3D a caminho nesta pagina? Se nao tem, o boot nao espera nada. */
export const heroRegistrado = () => existe;

export const heroJaPronto = () => pronto;

/** O canvas desenhou o primeiro frame: o hero esta de fato na tela. */
export const marcarHeroPronto = () => {
  if (pronto) return;
  pronto = true;
  ouvintes.forEach((avisar) => avisar());
  ouvintes.clear();
};

/** Chama `avisar` quando o hero ficar pronto (ou ja na hora, se ja estiver). */
export const aoHeroPronto = (avisar: () => void) => {
  if (pronto) {
    avisar();
    return () => {};
  }
  ouvintes.add(avisar);
  return () => {
    ouvintes.delete(avisar);
  };
};
