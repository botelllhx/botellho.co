import { useEffect, useState } from "react";

// Glifos com cara de terminal para o estado "cifrado"
const GLYPHS = "▓▒░<>/\\|#@%&$*+=~";

interface DecodeTextProps {
  text: string;
  /** atraso em ms antes de comecar a decifrar */
  delay?: number;
  /** duracao total em ms */
  duration?: number;
  className?: string;
}

/**
 * Decode/scramble: caracteres aleatorios que assentam no texto final,
 * da esquerda pra direita (Secao 5.3, a assinatura textual; usar com
 * parcimonia: 1 ou 2 palavras-chave por tela).
 *
 * SSG-safe: o texto final e o que vai pro HTML pre-renderizado; o efeito
 * so roda no client. Reduced-motion pula direto pro texto final.
 * O texto real fica em sr-only para leitores de tela.
 */
const DecodeText = ({ text, delay = 0, duration = 900, className }: DecodeTextProps) => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const start = performance.now() + delay;
    const id = setInterval(() => {
      const t = (performance.now() - start) / duration;
      if (t >= 1) {
        setDisplay(text);
        clearInterval(id);
        return;
      }
      if (t < 0) return;
      const settled = Math.floor(t * text.length);
      let out = text.slice(0, settled);
      for (let i = settled; i < text.length; i += 1) {
        const char = text[i];
        out += char === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
    }, 40);

    return () => clearInterval(id);
  }, [text, delay, duration]);

  return (
    <>
      <span aria-hidden="true" className={className}>
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
};

export default DecodeText;
