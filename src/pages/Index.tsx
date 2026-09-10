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
  ExternalLink,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';

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
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 py-20 md:py-28 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Protocol Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-mono font-medium text-primary backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>CREDIVIR PROTOCOL • ETHEREUM IMMUTABLE ATTESTATION</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Cryptographically Validated
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Academic Credentials
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Eliminate credential fraud with decentralized on-chain verification. CREDIVIR seals
              academic certificates directly onto Ethereum smart contracts for instant, zero-trust validation anywhere in the world.
            </p>

            {/* HERO INSTANT VERIFICATION BAR */}
            <div className="mx-auto mb-8 max-w-2xl">
              <form
                onSubmit={handleQuickVerify}
                className="relative flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-border/80 bg-card/90 p-2 shadow-2xl backdrop-blur-xl focus-within:border-primary/60 transition-all"
              >
                <div className="flex w-full items-center gap-2 pl-3">
                  <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    type="text"
                    value={heroInput}
                    onChange={(e) => setHeroInput(e.target.value)}
                    placeholder="Enter Certificate Hash or Verify URL..."
                    className="border-0 bg-transparent font-mono text-sm placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 shadow-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="default"
                  className="w-full sm:w-auto shrink-0 gap-2 font-medium px-6 shadow-md bg-primary hover:bg-primary/90"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verify Now</span>
                </Button>
              </form>

              {/* Sample Hashes */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">Quick test samples:</span>
                {sampleHashes.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => {
                      setHeroInput(s.hash);
                      navigate(`/verify?hash=${s.hash}`);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-border/40 text-left">
              <div className="space-y-1">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Architecture</p>
                <p className="text-sm font-semibold">Decentralized EVM</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Hashing Digest</p>
                <p className="text-sm font-semibold">Keccak256 / SHA-256</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Verification Latency</p>
                <p className="text-sm font-semibold">&lt; 350ms Direct Query</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Audit Model</p>
                <p className="text-sm font-semibold">100% Zero-Trust Proof</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dedicated Access Portals</h2>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">
              Segmented environments designed for verification parties, graduate recipients, and authorized registrars.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {portals.map((portal, index) => {
              const Icon = portal.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${portal.color} text-white shadow-md`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-border/80 bg-muted/60 text-muted-foreground">
                        {portal.badge}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">{portal.title}</CardTitle>
                      <CardDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {portal.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button asChild variant="outline" className="w-full justify-between group">
                      <Link to={portal.to}>
                        <span>{portal.actionText}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture & Enterprise Features */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary mb-2">
              <Shield className="h-3.5 w-3.5" />
              <span>Protocol Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Enterprise Grade Cryptographic Attestation
            </h2>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">
              Engineered with Ethereum state storage, cryptographic SHA-256 integrity, and IPFS persistence.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border/50 bg-card/40 p-6 transition-all hover:border-primary/30 hover:bg-card/70"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Verification Workflow */}
      <section className="py-20 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How CREDIVIR Verification Operates</h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Three deterministic steps guarantee mathematical certainty of authenticity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative rounded-xl border border-border/60 bg-card/80 p-6 space-y-3">
              <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">STEP 01</span>
              <h4 className="font-semibold text-base">Hash Generation</h4>
              <p className="text-sm text-muted-foreground">
                Institution combines recipient name, course, issuance date, and unique serial into an irreversible SHA-256 digest.
              </p>
            </div>
            <div className="relative rounded-xl border border-border/60 bg-card/80 p-6 space-y-3">
              <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">STEP 02</span>
              <h4 className="font-semibold text-base">On-Chain Anchoring</h4>
              <p className="text-sm text-muted-foreground">
                Registrar smart contract records the hash along with issuer public address and metadata into Ethereum state.
              </p>
            </div>
            <div className="relative rounded-xl border border-border/60 bg-card/80 p-6 space-y-3">
              <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">STEP 03</span>
              <h4 className="font-semibold text-base">Zero-Trust Verification</h4>
              <p className="text-sm text-muted-foreground">
                Third parties query the contract view function or scan the physical QR code to cross-verify against live ledger state.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modernized Portfolio Footer */}
      <footer className="mt-auto border-t border-border/60 bg-card/40 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-foreground tracking-tight">CREDIVIR</span>
                <span className="text-xs text-muted-foreground block">On-Chain Credential Attestation Protocol</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <Link to="/verify" className="hover:text-foreground transition-colors">Verify Certificate</Link>
              <Link to="/student" className="hover:text-foreground transition-colors">Student Portal</Link>
              <Link to="/admin" className="hover:text-foreground transition-colors">Admin Portal</Link>
              <a
                href="https://galaxir.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
              >
                Portfolio
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://github.com/Cipher-Shadow-IR"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
              >
                GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>
              Designed & Engineered by <a href="https://galaxir.vercel.app" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">Ishaan Ray</a> • Blockchain Systems Engineer
            </p>
            <p className="font-mono">
              Ethereum Smart Contract • Solidity • Ethers.js • React • IPFS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
