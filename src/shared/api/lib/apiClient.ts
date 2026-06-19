import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { createApiError } from './apiError';

/** Имя читаемой JS флаг-куки «залогинен». Сами токены — в httpOnly-куках, JS их не видит. */
export const AUTH_FLAG_COOKIE = 'vpn_auth';

/** Прочитать флаг авторизации из куки (SSR-safe). */
export function readAuthFlag(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim().startsWith(`${AUTH_FLAG_COOKIE}=1`));
}

/**
 * Axios-инстанс. Запросы идут в свой origin под `/api`; Express проксирует их на
 * бэкенд и подставляет access-токен из httpOnly-куки. На 401 — авто-refresh через BFF.
 */
export const apiClient = axios.create({ withCredentials: true });

// Single-flight: параллельные 401 ждут один общий refresh.
let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = axios
      .post('/bff/auth/refresh', null, { withCredentials: true })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: string }>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    const isAuthCall = original?.url?.includes('/bff/auth/') ?? false;

    // На протухший access (401) один раз обновляем токен через BFF и повторяем запрос.
    if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true;
      if (await refreshSession()) {
        return apiClient(original); // токен обновлён в куке — запрос пройдёт заново
      }
    }

    throw createApiError({
      statusCode: error.response?.status ?? null,
      url: error.config?.url ?? '',
      method: error.config?.method ?? '',
      message: error.response?.data?.error ?? error.message ?? 'Request failed',
      raw: error,
    });
  },
);
