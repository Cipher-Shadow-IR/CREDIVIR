import React from 'react';
import { ShieldCheck, Cpu, Database, Award, Binary, KeyRound } from 'lucide-react';

interface MarqueeProps {
  className?: string;
}

const ITEMS = [
  { label: 'Ethereum Smart Contract', icon: Cpu },
  { label: 'SHA-256 Digest Ledger', icon: Binary },
  { label: 'IPFS Content Addressed', icon: Database },
  { label: 'EIP-712 Typed Attestation', icon: KeyRound },
  { label: 'Tamper-Evident Permanence', icon: ShieldCheck },
  { label: 'Instant Zero-Auth Verifier', icon: Award },
];

export const Marquee: React.FC<MarqueeProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full overflow-hidden border-y border-border/40 bg-card/40 py-3.5 backdrop-blur-sm select-none ${className}`}
      aria-hidden="true"
    >
      <div className="flex w-max items-center gap-10 animate-marquee">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span>{item.label}</span>
              <span className="text-primary/40">◆</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Marquee;
