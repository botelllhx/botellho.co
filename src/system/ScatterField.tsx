import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/motion/prefs";

// "Como a gente trabalha": os paragrafos ganham fisica tipo a tela de descanso
// de DVD antigo. Cada frase deriva pelo palco, bate nas bordas trocando de cor
// (azul <-> preto) e colide com as outras se empurrando. Fundo branco, entao as
// duas cores aparecem. Mobile e reduced-motion: lista estatica, legivel.
// Afirmativo: o METODO, o que a gente faz e entrega. As recusas bem-humoradas
// (o que a gente NAO faz) ficam na secao "regras da casa", pra nao repetir.
const FRASES = [
  "a gente escreve o próprio código",
  "3d que roda em qualquer máquina",
  "design que passa no acessível",
  "performance faz parte do craft",
  "arte e engenharia na mesma mesa",
  "protótipo navegável antes do código",
  "entrega no prazo combinado",
  "acompanhamento depois do lançamento",
];

const INK = "hsl(var(--foreground))";
const BLUE = "hsl(var(--phosphor))";

const ScatterField = () => {
  const stage = useRef<HTMLDivElement>(null);
  const itens = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const st = stage.current;
    if (!st) return;

    let W = st.clientWidth;
    let H = st.clientHeight;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const corpos = itens.current.filter(Boolean).map((el, i) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const azul = i % 2 === 0;
      el.style.color = azul ? BLUE : INK;
      el.style.opacity = "1";
      return {
        el,
        w,
        h,
        x: rand(0, Math.max(1, W - w)),
        y: rand(0, Math.max(1, H - h)),
        vx: (Math.random() < 0.5 ? -1 : 1) * rand(38, 72),
        vy: (Math.random() < 0.5 ? -1 : 1) * rand(38, 72),
        azul,
      };
    });

    // reduced-motion: sem fisica, dispoe em coluna legivel
    if (prefersReducedMotion()) {
      let y = 0;
      for (const c of corpos) {
        c.el.style.transform = `translate(0px, ${y}px)`;
        y += c.h + 24;
      }
      return;
    }

    const flip = (c: (typeof corpos)[number]) => {
      c.azul = !c.azul;
      c.el.style.color = c.azul ? BLUE : INK;
    };

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      for (const c of corpos) {
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        if (c.x <= 0) { c.x = 0; c.vx = Math.abs(c.vx); flip(c); }
        else if (c.x + c.w >= W) { c.x = W - c.w; c.vx = -Math.abs(c.vx); flip(c); }
        if (c.y <= 0) { c.y = 0; c.vy = Math.abs(c.vy); flip(c); }
        else if (c.y + c.h >= H) { c.y = H - c.h; c.vy = -Math.abs(c.vy); flip(c); }
      }

      // colisao AABB: separa e troca a velocidade no eixo de menor sobreposicao
      for (let a = 0; a < corpos.length; a += 1) {
        for (let b = a + 1; b < corpos.length; b += 1) {
          const A = corpos[a];
          const B = corpos[b];
          if (A.x < B.x + B.w && A.x + A.w > B.x && A.y < B.y + B.h && A.y + A.h > B.y) {
            const ox = Math.min(A.x + A.w - B.x, B.x + B.w - A.x);
            const oy = Math.min(A.y + A.h - B.y, B.y + B.h - A.y);
            if (ox < oy) {
              const push = ox / 2;
              if (A.x < B.x) { A.x -= push; B.x += push; } else { A.x += push; B.x -= push; }
              const t = A.vx; A.vx = B.vx; B.vx = t;
            } else {
              const push = oy / 2;
              if (A.y < B.y) { A.y -= push; B.y += push; } else { A.y += push; B.y -= push; }
              const t = A.vy; A.vy = B.vy; B.vy = t;
            }
          }
        }
      }

      for (const c of corpos) c.el.style.transform = `translate(${c.x}px, ${c.y}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      W = st.clientWidth;
      H = st.clientHeight;
      for (const c of corpos) {
        c.x = Math.min(c.x, Math.max(0, W - c.w));
        c.y = Math.min(c.y, Math.max(0, H - c.h));
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="overflow-hidden bg-background px-4 py-20 md:px-6 md:py-28">
      <span className="type-label text-muted-foreground">como a gente trabalha</span>

      {/* desktop: palco com fisica de DVD */}
      <div ref={stage} className="relative mt-8 hidden h-[80vh] overflow-hidden border border-foreground/15 md:block">
        {FRASES.map((f, i) => (
          <span
            key={f}
            ref={(el) => { if (el) itens.current[i] = el; }}
            style={{ opacity: 0, willChange: "transform" }}
            className="absolute left-0 top-0 whitespace-nowrap font-sans text-xl font-medium leading-none md:text-2xl"
          >
            {f}
          </span>
        ))}
      </div>

      {/* mobile / reduced-motion: lista estatica legivel */}
      <ul className="mt-8 flex flex-col gap-4 md:hidden">
        {FRASES.map((f, i) => (
          <li key={f} className={`font-sans text-2xl font-medium leading-tight ${i % 2 === 0 ? "text-phosphor" : "text-foreground"}`}>{f}</li>
        ))}
      </ul>
    </section>
  );
};

export default ScatterField;
