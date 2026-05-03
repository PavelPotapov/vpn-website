import { useCallback } from 'react';
import { useNavigate as useRRNavigate, useParams } from 'react-router';
import type { NavigateOptions } from 'react-router';

function withLocalePrefix(path: string, locale: string | undefined): string {
  if (!locale || !path.startsWith('/')) return path;
  return `/${locale}${path}`;
}

export function useNavigate() {
  const rrNavigate = useRRNavigate();
  const { locale } = useParams<{ locale?: string }>();

  return useCallback(
    (to: string, options?: NavigateOptions) => {
      const resolvedPath = withLocalePrefix(to, locale);
      rrNavigate(resolvedPath, { ...options });
    },
    [rrNavigate, locale],
  );
}
