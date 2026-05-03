import { Globe } from 'lucide-react';
import { useParams, useLocation } from 'react-router';

import { cn } from '@/shared/lib';
import { SUPPORTED_LANGUAGE_CODES } from '@/shared/lib/i18n';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale } = useParams<{ locale?: string }>();
  const location = useLocation();

  const currentLocale = locale ?? 'en';

  function getLocalizedPath(targetLocale: string) {
    const pathWithoutLocale = locale
      ? location.pathname.replace(`/${locale}`, '') || '/'
      : location.pathname;

    if (targetLocale === 'en') return pathWithoutLocale;
    return `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Globe className="text-muted-foreground h-4 w-4" />
      {SUPPORTED_LANGUAGE_CODES.map((code) => (
        <a
          key={code}
          href={getLocalizedPath(code)}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-medium uppercase transition-colors',
            currentLocale === code
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {code}
        </a>
      ))}
    </div>
  );
}
