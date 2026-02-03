import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoaderProps {
  onComplete: () => void;
}

const Loader = ({ onComplete }: LoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = 2500;
    const interval = 50;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsExiting(true), 300);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <div className="flex items-baseline gap-1" ref={(el) => {
                if (!el) return;
                // Avoid re-adding if already populated
                if (el.querySelector('.logo-char')) return;

                const text = "botellho";
                el.innerHTML = '';

                // Re-construct with spans for animation
                text.split('').forEach((char, index) => {
                  const span = document.createElement('span');
                  span.textContent = char;
                  span.className = 'logo-char text-4xl font-bold tracking-tight text-foreground md:text-5xl font-display';
                  // Ensure correct width for stability
                  span.style.width = '0.7em';
                  span.style.textAlign = 'center';
                  span.style.setProperty('--char-index', index.toString());
                  el.appendChild(span);
                });

                const dot = document.createElement('span');
                dot.textContent = '.co';
                dot.className = 'text-primary text-4xl font-bold tracking-tight md:text-5xl font-display italic';
                el.appendChild(dot);
              }}>
                <span className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  botellho<span className="text-primary">.co</span>
                </span>
              </div>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="w-64 md:w-96"
            >
              <div className="h-[2px] w-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress / 100 }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <div className="mt-4 flex justify-between">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Carregando
                </span>
                <span className="font-mono text-xs text-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16"
            >
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                Belo Horizonte, MG
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
