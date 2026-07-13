interface SystemDividerProps {
  /** texto repetido na fita (voz de terminal) */
  text?: string;
  /** mostra o selo do Ban dithered no centro */
  ban?: boolean;
}

// Divisor de sistema: uma fita de bitmap em fosforo que corre entre secoes,
// com selo do Ban opcional. Coesao "basement" nos detalhes.
const FILLER = "▚ ▞ ░ ▒ ▓ █ ";

const SystemDivider = ({ text = "botellho.sys", ban = false }: SystemDividerProps) => {
  const unit = `${FILLER}${text} `;
  return (
    <div className="relative border-y border-foreground/15 bg-background py-2" aria-hidden>
      <div className="tape">
        <div className="tape-track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="type-dos mx-2 text-xs text-phosphor/70">
              {unit}
            </span>
          ))}
        </div>
      </div>
      {ban ? (
        <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-background">
          <img src="/ban/ban-1.png" alt="" className="h-7 w-7 object-contain" style={{ imageRendering: "pixelated" }} />
        </span>
      ) : null}
    </div>
  );
};

export default SystemDivider;
