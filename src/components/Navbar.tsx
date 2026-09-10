import { Link, useLocation } from 'react-router-dom';
import { Shield, GraduationCap, CheckCircle2, Menu, X, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Overview', icon: Shield },
    { to: '/verify', label: 'Verify Certificate', icon: CheckCircle2 },
    { to: '/student', label: 'Student Portal', icon: GraduationCap },
    { to: '/admin', label: 'Admin Portal', icon: Shield },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl transition-all">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-foreground font-sans">CREDIVIR</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-primary uppercase tracking-wider">v2.4 Core</span>
            </div>
            <span className="text-[11px] text-muted-foreground -mt-0.5 hidden sm:block">On-Chain Credential Attestation</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Action Button & Ishaan Ray attribution */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="https://galaxir.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <span>by Ishaan Ray</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <Button asChild size="sm" className="gap-2 shadow-sm font-medium">
            <Link to="/verify">
              <CheckCircle2 className="h-4 w-4" />
              <span>Verify Now</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-lg p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <a
                href="https://galaxir.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-muted-foreground hover:underline"
              >
                Engineered by Ishaan Ray
              </a>
              <Button asChild size="sm" className="gap-1.5" onClick={() => setIsMenuOpen(false)}>
                <Link to="/verify">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verify
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

