interface SystemDividerProps {
  /** rotulo em portugues claro no centro do divisor */
  label?: string;
  /** mostra o selo do Ban dithered */
  ban?: boolean;
}

// Divisor estatico (sem carrossel): uma regua com glifos de bloco e um
// rotulo claro em PT ao centro. Coesao nos detalhes, sem movimento.
const SystemDivider = ({ label, ban = false }: SystemDividerProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 md:px-6" aria-hidden>
      <span className="type-dos text-xs text-phosphor/60">{"▀▀▀"}</span>
      <span className="h-px flex-1 bg-foreground/15" />
      {ban ? (
        <img src="/ban/ban-1.png" alt="" className="h-6 w-6 object-contain" style={{ imageRendering: "pixelated" }} />
      ) : null}
      {label ? <span className="type-label text-muted-foreground">{label}</span> : null}
      <span className="h-px flex-1 bg-foreground/15" />
      <span className="type-dos text-xs text-phosphor/60">{"►"}</span>
    </div>
  );
};

export default SystemDivider;
