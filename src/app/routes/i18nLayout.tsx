import { useEffect } from 'react';
import { Outlet, useParams, redirect } from 'react-router';

import i18n from '@/app/.infra/i18n/config';
import { SUPPORTED_LANGUAGE_CODES } from '@/shared/lib/i18n';

import type { Route } from './+types/i18nLayout';

const DEFAULT_LOCALE = 'en';

/**
 * ВАЖНО: синхронизация i18n на SSR до рендера.
 * В Vite dev mode SSR и клиент делят один процесс — singleton i18n
 * может содержать язык от предыдущего клиентского визита.
 * Без этой синхронизации SSR рендерит на одном языке,
 * а клиент определяет язык по URL → hydration mismatch.
 * Решение: в loader (до рендера) ставим i18n.language из URL params.
 */
export function loader({ params }: Route.LoaderArgs) {
  const { locale } = params;
  if (locale != null && !SUPPORTED_LANGUAGE_CODES.includes(locale)) {
    throw redirect('/');
  }

  const resolvedLocale = locale ?? DEFAULT_LOCALE;
  if (i18n.language !== resolvedLocale) {
    i18n.changeLanguage(resolvedLocale);
  }

  return null;
}

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { locale } = params;
  if (locale != null && !SUPPORTED_LANGUAGE_CODES.includes(locale)) {
    throw redirect('/');
  }
  return null;
}

export default function I18nLayout() {
  const { locale } = useParams<{ locale?: string }>();
  const resolvedLocale = locale ?? DEFAULT_LOCALE;

  useEffect(() => {
    if (i18n.language !== resolvedLocale) {
      void i18n.changeLanguage(resolvedLocale);
    }
    document.documentElement.lang = resolvedLocale;
  }, [resolvedLocale]);

  return <Outlet />;
}
