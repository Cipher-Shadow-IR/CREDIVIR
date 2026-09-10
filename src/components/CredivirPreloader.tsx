import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export const CredivirPreloader: React.FC = () => {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const t = setTimeout(() => setDone(true), 120);
      return () => clearTimeout(t);
    }

    let raf: number;
    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        const t2 = setTimeout(() => setDone(true), 160);
        raf = t2 as unknown as number;
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background" aria-hidden="true">
      <div className="flex flex-col items-center gap-6 text-center select-none">
        {/* Shield / Verification Mark */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-primary/10 blur-2xl" />
          <div data-pre-ring className="h-20 w-20 rounded-2xl border border-primary/30 bg-card/60 backdrop-blur flex items-center justify-center shadow-xl [animation:credivir_pulse_2s_ease-in-out_infinite]">
            <ShieldCheck className="h-9 w-9 text-primary" />
          </div>
        </div>

        {/* Wordmark */}
        <div className="space-y-1">
          <span className="font-display text-lg font-bold tracking-widest uppercase text-foreground block">
            CREDIVIR<span className="text-primary">.</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground block">
            Sealing Verification Vault
          </span>
        </div>

        {/* Precise progress line */}
        <div className="w-52 space-y-1.5">
          <div className="h-px w-full overflow-hidden bg-muted rounded-full">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
            <span>KECCAK-256</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes credivir_pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
          50% { transform: scale(1.04); box-shadow: 0 0 24px rgba(99, 102, 241, 0.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-pre-ring] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CredivirPreloader;