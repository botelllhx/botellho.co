import { useEffect } from "react";

// Cursor de terminal (Secao 5.6): bloco/caret em phosphor com blink, um
// pixel que lidera o movimento, moldura [ ] sobre controles, crosshair
// sobre areas 3D (data-cursor="3d") e press de 1px. Touch: desativado.
const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], label';

// Descobre se o fundo sob o cursor e escuro (azul/preto) pra inverter a cor do
// cursor, senao ele some em cima do phosphor.
const isDarkUnder = (target: HTMLElement | null) => {
  let node: HTMLElement | null = target;
  let depth = 0;
  while (node && depth < 8) {
    const c = getComputedStyle(node).backgroundColor;
    const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    if (m && (m[4] === undefined || Number(m[4]) > 0.1)) {
      const lum = 0.299 * Number(m[1]) + 0.587 * Number(m[2]) + 0.114 * Number(m[3]);
      return lum < 140;
    }
    node = node.parentElement;
    depth += 1;
  }
  return false;
};

const CursorSystem = () => {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const block = document.createElement("div");
    block.className = "cursor";
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const label = document.createElement("div");
    label.className = "cursor-label";
    document.body.append(block, dot, label);

    let mouseX = -100;
    let mouseY = -100;
    let blockX = -100;
    let blockY = -100;
    let raf = 0;

    const tick = () => {
      blockX += (mouseX - blockX) * 0.22;
      blockY += (mouseY - blockY) * 0.22;
      block.style.left = `${blockX}px`;
      block.style.top = `${blockY}px`;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      label.style.left = `${mouseX}px`;
      label.style.top = `${mouseY}px`;
      raf = requestAnimationFrame(tick);
    };

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      const target = event.target as HTMLElement | null;
      // areas com cursor nativo (hero 3D interativo): esconde o cursor custom,
      // senao ficariam os dois desenhados ao mesmo tempo
      const nativo = !!target?.closest('[data-cursor="nativo"]');
      block.classList.toggle("is-off", nativo);
      dot.classList.toggle("is-off", nativo);
      label.classList.toggle("is-off", nativo);
      if (nativo) return;
      const isCrosshair = !!target?.closest('[data-cursor="3d"]');
      const card = target?.closest("[data-cursor-label]") as HTMLElement | null;
      const isHover = !isCrosshair && !card && !!target?.closest(INTERACTIVE);
      block.classList.toggle("is-crosshair", isCrosshair);
      block.classList.toggle("is-hover", isHover);
      block.classList.toggle("is-card", !!card);
      const dark = isDarkUnder(target);
      block.classList.toggle("is-on-dark", dark);
      dot.classList.toggle("is-on-dark", dark);
      label.classList.toggle("is-on-dark", dark);
      label.textContent = card?.dataset.cursorLabel ?? "";
      label.classList.toggle("is-on", !!card);
    };
    const handleDown = () => block.classList.add("is-press");
    const handleUp = () => block.classList.remove("is-press");

    document.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      block.remove();
      dot.remove();
      label.remove();
    };
  }, []);

  return null;
};

export default CursorSystem;
