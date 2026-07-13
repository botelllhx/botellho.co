import { useEffect } from "react";

// Cursor de terminal (Secao 5.6): bloco/caret em phosphor com blink, um
// pixel que lidera o movimento, moldura [ ] sobre controles, crosshair
// sobre areas 3D (data-cursor="3d") e press de 1px. Touch: desativado.
const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], label';

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
      const isCrosshair = !!target?.closest('[data-cursor="3d"]');
      const card = target?.closest("[data-cursor-label]") as HTMLElement | null;
      const isHover = !isCrosshair && !card && !!target?.closest(INTERACTIVE);
      block.classList.toggle("is-crosshair", isCrosshair);
      block.classList.toggle("is-hover", isHover);
      block.classList.toggle("is-card", !!card);
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
