import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  GraduationCap,
  FileCheck,
  Search,
  Fingerprint,
  Cpu,
  Globe2,
  Sparkles,
  QrCode,
  ShieldCheck,
  Database,
  FileBadge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { CountUp } from '@/components/CountUp';
import { Reveal } from '@/components/Reveal';
import { Marquee } from '@/components/Marquee';

const Index = () => {
  const [heroInput, setHeroInput] = useState('');
  const navigate = useNavigate();

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroInput.trim()) {
      navigate('/verify');
      return;
    }
    navigate(`/verify?hash=${encodeURIComponent(heroInput.trim())}`);
  };

  const sampleHashes = [
    { label: 'CS Degree 2024', hash: '0x8f2d5e1b9c3a4f7e2d1c0b8a7f6e5d4c3b2a1098' },
    { label: 'Blockchain Dipl.', hash: '0x3c9a1b4e7f8d2e6a5c1b0d9e8f7a6b5c4d3e2f1a' },
  ];

  const features = [
    {
      icon: Lock,
      title: 'Cryptographic SHA-256 Ledger',
      description:
        'Every certificate digest is anchored onto Ethereum smart contracts, guaranteeing 100% tamper-evident permanence and verifiable provenance.'
    },
    {
      icon: Zap,
      title: 'Instant Decoupled Verification',
      description:
        'Employers, background screeners, and universities can verify credential authenticity in sub-seconds via hash, direct URL, or QR upload without logging in.'
    },
    {
      icon: Fingerprint,
      title: 'Decentralized Identity & Proof',
      description:
        'Institutions cryptographically sign credentials with Ethereum keypairs, eliminating fake degrees and diploma mill fraud completely.'
    },
    {
      icon: Globe2,
      title: 'IPFS Distributed Document Storage',
      description:
        'High-resolution certificate assets and metadata reside on content-addressed IPFS nodes, ensuring censorship-resistant accessibility worldwide.'
    },
    {
      icon: Cpu,
      title: 'Smart Contract Automation',
      description:
        'Audited Solidity agreements automate student records, issuance logs, and historical validity checks with transparent on-chain audit trails.'
    },
    {
      icon: QrCode,
      title: 'Dual Mode Attestation',
      description:
        'Embedded high-density QR codes allow both digital scans and physical printed paper verification with seamless canvas-to-PDF rendering.'
    }
  ];

  const portals = [
    {
      to: '/verify',
      icon: FileCheck,
      title: 'Public Verification Engine',
      badge: 'Zero Auth Required',
      description:
        'Instant attestation portal for hiring managers, credential evaluators, and embassies to validate hashes and scan QR images.',
      color: 'from-blue-600 to-indigo-600',
      actionText: 'Launch Verifier'
    },
    {
      to: '/student',
      icon: GraduationCap,
      title: 'Student Credential Vault',
      badge: 'Graduate Access',
      description:
        'Access personal verifiable transcripts, download tamper-proof cryptographic PDFs, and inspect verified on-chain blockchain records.',
      color: 'from-indigo-600 to-violet-600',
      actionText: 'Open Student Vault'
    },
    {
      to: '/admin',
      icon: Shield,
      title: 'Institutional Issuance Node',
      badge: 'Registrar Auth',
      description:
        'Authorized academic registrar dashboard for minting student credentials, generating SHA-256 hashes, and signing on-chain transactions.',
      color: 'from-violet-600 to-purple-600',
      actionText: 'Access Registrar Portal'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 overflow-x-hidden">
      <Navbar />

      {/* Hero Section with Floating Tilted UI Cards */}
      <section className="relative overflow-hidden border-b border-border/40 py-14 sm:py-16 md:py-24 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        
        {/* Subtle Ambient Blobs */}
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl animate-float-slower" />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Interaction (Col 7) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Protocol Badge */}
              <Reveal direction="up" className="inline-flex">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-mono font-medium text-primary backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>CREDIVIR PROTOCOL • ETHEREUM IMMUTABLE ATTESTATION</span>
                </div>
              </Reveal>

              {/* Disciplined Scale Headline */}
              <Reveal direction="up" delay={90}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
                  Cryptographically Validated
                  <br />
<span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-blue-500 dark:to-cyan-400">
                  Academic Credentials
                </span>
                </h1>
              </Reveal>

              <Reveal direction="up" delay={180}>
                <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
                  Eliminate credential fraud with decentralized on-chain verification. CREDIVIR seals
                  academic certificates directly onto Ethereum smart contracts for instant, zero-trust validation anywhere in the world.
                </p>
              </Reveal>

              <Reveal direction="up" delay={270}>
              {/* HERO INSTANT VERIFICATION BAR */}
              <div className="pt-2 max-w-xl">
                <form
                  onSubmit={handleQuickVerify}
                  className="relative flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-border/80 bg-card/90 p-2 shadow-xl backdrop-blur-xl focus-within:border-primary/60 transition-all"
                >
                  <div className="flex w-full items-center gap-2 pl-3">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      type="text"
                      value={heroInput}
                      onChange={(e) => setHeroInput(e.target.value)}
                      placeholder="Enter Certificate Hash or Verify URL..."
                      className="border-0 bg-transparent font-mono text-xs sm:text-sm placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 shadow-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="default"
                    className="w-full sm:w-auto shrink-0 gap-2 font-medium px-5 text-xs shadow-md bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verify Now</span>
                  </Button>
                </form>

                {/* Sample Hashes */}
                <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-muted-foreground">
                  <span className="font-mono text-[11px]">Quick test samples:</span>
                  {sampleHashes.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => {
                        setHeroInput(s.hash);
                        navigate(`/verify?hash=${s.hash}`);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              </Reveal>

              {/* Quick Metrics Bar with Animated Counters */}
              <Reveal direction="up" delay={340}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/40 text-left">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Credentials Sealed</p>
                  <p className="text-sm sm:text-base font-bold text-foreground">
                    <CountUp end={18420} suffix="+" />
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Hashing Digest</p>
                  <p className="text-sm sm:text-base font-bold text-foreground">Keccak256</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Verify Latency</p>
                  <p className="text-sm sm:text-base font-bold text-foreground">
                    &lt; <CountUp end={320} suffix="ms" />
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Tamper Protection</p>
                  <p className="text-sm sm:text-base font-bold text-foreground">
                    <CountUp end={100} suffix="% On-Chain" />
                  </p>
                </div>
              </div>
              </Reveal>
            </div>

            {/* Right Column: Floating Tilted Cryptographic UI Cards (Col 5) */}
            <div className="lg:col-span-5 relative h-[380px] sm:h-[420px] flex items-center justify-center min-w-0">
              <div className="relative w-full max-w-sm h-full">
                
                {/* Floating Card 1: Verified On-Chain Attestation */}
                <div className="absolute left-[2%] top-[10%] w-[88%] rounded-2xl border border-primary/30 bg-card/90 p-5 shadow-2xl backdrop-blur-xl animate-float-slow z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-foreground">CRYPTOGRAPHIC SEAL</span>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-semibold uppercase">
                      Active On-Chain
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <p className="text-xs font-semibold text-foreground">B.Sc. in Computer Science & Systems</p>
                    <p className="text-[11px] font-mono text-muted-foreground">Recipient: Alex Rivera (ID: 2024-CS-091)</p>
                    <div className="rounded-lg bg-muted/50 p-2 font-mono text-[10px] text-primary break-all border border-border/50">
                      0x8f2d5e1b9c3a4f7e2d1c0b8a7f6e5d4c3b2a1098
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
                    <span>Block: #19482104</span>
                    <span className="text-emerald-400 font-semibold">100% Authentic</span>
                  </div>
                </div>

                {/* Floating Card 2: IPFS Document Vault */}
                <div className="absolute right-[0%] top-[4%] w-[68%] rounded-xl border border-border/80 bg-card/95 p-4 shadow-xl backdrop-blur-xl animate-float-slower z-30">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-mono font-medium text-foreground">IPFS Pinning</span>
                  </div>
                  <p className="mt-1 text-[10px] font-mono text-muted-foreground truncate">
                    QmXoypizjW3WknFiJnKLwHCn...
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                    <span>Immutability check</span>
                    <span className="font-bold">VERIFIED</span>
                  </div>
                </div>

                {/* Floating Card 3: Dual QR Scan Attestation */}
                <div className="absolute left-[12%] bottom-[6%] w-[72%] rounded-xl border border-indigo-500/30 bg-card/90 p-4 shadow-xl backdrop-blur-xl animate-float z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-foreground">Dual-Scan QR</span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400">EIP-712</span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">Physical & digital transcript validation</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Infinite Marquee Ticker */}
      <Marquee />

      {/* Portals Section */}
      <section className="py-16 sm:py-20 bg-card/20 border-b border-border/40">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center mb-12 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dedicated Access Portals</h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Segmented environments designed for verification parties, graduate recipients, and authorized registrars.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {portals.map((portal, index) => {
              const Icon = portal.icon;
              return (
                <Reveal key={index} delay={index * 120}>
                  <Card className="h-full relative overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${portal.color} text-white shadow-md`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-border/80 bg-muted/60 text-muted-foreground">
                          {portal.badge}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">{portal.title}</CardTitle>
                        <CardDescription className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {portal.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <Link to={portal.to} className="w-full block">
                        <Button variant="outline" className="w-full justify-between group text-xs">
                          <span>{portal.actionText}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-primary" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Protocol Features */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                Core Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Institutional Trust Primitives</h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Purpose-built cryptography and decentralized protocols ensuring credentials can never be altered, forged, or lost.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={index} delay={index * 80}>
                  <div className="rounded-xl border border-border/60 bg-card/40 p-6 space-y-3 transition-all duration-300 hover:border-primary/40 hover:bg-card/70 h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 bg-card/40 py-8 text-xs text-muted-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">CREDIVIR Protocol</span>
            <span>• Ethereum Immutable Attestation</span>
          </div>
          <p>© {new Date().getFullYear()} CREDIVIR. Open Source Academic Blockchain Protocol.</p>
          <p className="font-medium text-foreground/80">
            Designed & Developed by <span className="font-semibold text-primary">ISHAAN RAY</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
