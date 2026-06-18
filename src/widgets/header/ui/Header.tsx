import { Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { useTranslation } from '@/shared/lib/i18n';
import { useLocalePath } from '@/shared/lib/navigation';
import { Button } from '@/shared/ui/button';

import { AccountNav } from './AccountNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: lp('/'), label: t('nav.home') },
    { href: lp('/features'), label: t('nav.features', 'Features') },
    { href: lp('/pricing'), label: t('nav.pricing') },
  ];

  return (
    <header className="bg-background/80 border-border/50 sticky top-0 z-50 border-b backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to={lp('/')} className="flex items-center gap-2 text-lg font-bold">
          <Shield className="text-primary h-6 w-6" />
          <span>VPN</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <AccountNav />
          <Button size="sm" className="rounded-xl">
            {t('hero.cta')}
          </Button>
        </div>

        <button
          type="button"
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="bg-background border-border border-b px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between">
            <LanguageSwitcher />
            <ThemeToggle />
            <AccountNav />
          </div>
          <Button className="mt-4 w-full rounded-xl" onClick={() => setMobileOpen(false)}>
            {t('hero.cta')}
          </Button>
        </div>
      )}
    </header>
  );
}
