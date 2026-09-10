import React from 'react';
import { ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';

interface CredivirLoaderProps {
  message?: string;
  submessage?: string;
}

export const CredivirLoader: React.FC<CredivirLoaderProps> = ({
  message = "Validating Cryptographic Proof on Ethereum...",
  submessage = "Querying smart contract Keccak256 hash registry"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
      {/* Animated Official CREDIVIR Logo Preloader */}
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-60" />
        <div className="absolute inset-1 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <div className="absolute inset-3 rounded-full border-2 border-indigo-500/40 border-b-cyan-400 animate-spin [animation-direction:reverse]" />
        <img
          src="/CREDIVIR_LOGO.png"
          alt="CREDIVIR"
          className="relative z-10 w-10 h-10 object-contain animate-bounce [animation-duration:2.5s]"
        />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <span className="font-display text-sm font-bold tracking-widest uppercase text-foreground block">
          CREDIVIR<span className="text-primary">.</span>
        </span>
        <h4 className="text-sm font-bold tracking-tight text-foreground font-display">
          {message}
        </h4>
        <p className="text-xs text-muted-foreground font-mono leading-relaxed">
          {submessage}
        </p>
      </div>

      <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 w-3/4 rounded-full animate-pulse" />
      </div>
    </div>
  );
};
