import { useEffect } from 'react';
import { Outlet, useParams, redirect } from 'react-router';

import i18n from '@/app/.infra/i18n/config';

import { SUPPORTED_LANGUAGE_CODES } from '@/shared/lib/i18n';

import type { Route } from './+types/i18nLayout';

const DEFAULT_LOCALE = 'en';
const LANG_STORAGE_KEY = 'vpn-lang';

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

export function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  const { locale } = params;
  if (locale != null && !SUPPORTED_LANGUAGE_CODES.includes(locale)) {
    throw redirect('/');
  }

  if (locale == null) {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      const preferred = stored && SUPPORTED_LANGUAGE_CODES.includes(stored) ? stored : 'ru';
      if (preferred !== 'en') {
        const url = new URL(request.url);
        throw redirect(`/${preferred}${url.pathname === '/' ? '' : url.pathname}`);
      }
    } catch (e) {
      if (e instanceof Response) throw e;
    }
  }

  if (locale) {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, locale);
    } catch (_) {
      /* storage unavailable */
    }
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
    try {
      localStorage.setItem(LANG_STORAGE_KEY, resolvedLocale);
    } catch (_) {
      /* storage unavailable */
    }
  }, [resolvedLocale]);

  return <Outlet />;
}
