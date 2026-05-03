import { Link } from 'react-router';
import { Shield, Send } from 'lucide-react';

import { useTranslation } from '@/shared/lib/i18n';
import { useLocalePath } from '@/shared/lib/navigation';

export function Footer() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-border border-t">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to={lp('/')} className="flex items-center gap-2 text-lg font-bold">
              <Shield className="text-primary h-5 w-5" />
              <span>VPN</span>
            </Link>
            <p className="text-muted-foreground mt-3 text-sm">
              {t('footer.description', 'Fast and secure VPN service with modern protocols.')}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t('footer.navigation', 'Navigation')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to={lp('/')} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to={lp('/features')} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('nav.features', 'Features')}
                </Link>
              </li>
              <li>
                <Link to={lp('/pricing')} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('nav.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t('footer.legal', 'Legal')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t('footer.social', 'Social')}</h4>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
            >
              <Send className="h-4 w-4" />
              Telegram
            </a>
          </div>
        </div>

        <div className="border-border mt-8 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            {t('footer.copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
