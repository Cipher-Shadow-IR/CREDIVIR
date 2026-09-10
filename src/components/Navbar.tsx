import { Link, useLocation } from 'react-router-dom';
import { Shield, GraduationCap, CheckCircle2, Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

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
          <img
            src="/CREDIVIR_LOGO.png"
            alt="CREDIVIR Logo"
            className="h-9 w-9 object-contain group-hover:scale-105 transition-transform shrink-0"
          />
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

        {/* Action Button & Ishaan Ray attribution & Theme Toggle */}
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

          {/* Light / Dark Mode Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
            aria-label={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
            className="h-9 w-9 border-border/80 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-[#FBBF24] transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-[#1E40AF] transition-transform hover:-rotate-12" />
            )}
          </Button>

          <Button asChild size="sm" className="gap-2 shadow-sm font-medium">
            <Link to="/verify">
              <CheckCircle2 className="h-4 w-4" />
              <span>Verify Now</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button & Quick Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-[#FBBF24]" />
            ) : (
              <Moon className="h-4 w-4 text-[#1E40AF]" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
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
              <span className="text-xs font-mono text-muted-foreground uppercase">Theme</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="gap-2 h-8 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-[#FBBF24]" />
                    <span className="text-xs">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-[#1E40AF]" />
                    <span className="text-xs">Dark Mode</span>
                  </>
                )}
              </Button>
            </div>
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

