import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { createApiError } from './apiError';

/** Ключи localStorage для токенов. */
export const AUTH_TOKEN_KEY = 'vpn-auth-token';
export const REFRESH_TOKEN_KEY = 'vpn-refresh-token';

function getStored(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
}

function persistTokens(accessToken: string, refreshToken?: string | null) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  if (refreshToken) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function clearTokens() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Настроенный инстанс Axios. Запросы идут в свой origin под `/api`, который
 * Express-сервер проксирует на бэкенд (поэтому CORS не нужен). Bearer-токен
 * читается из localStorage на каждый запрос; на 401 — авто-обновление токена.
 */
export const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = getStored(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Single-flight: параллельные 401 ждут один общий запрос обновления токена.
let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getStored(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  if (!refreshInFlight) {
    refreshInFlight = axios
      .post<{ access_token: string; refresh_token: string }>('/api/v2/auth/refresh', {
        refresh_token: refreshToken,
      })
      .then((res) => {
        persistTokens(res.data.access_token, res.data.refresh_token);
        return res.data.access_token;
      })
      .catch(() => {
        clearTokens();
        return null;
      })
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
    const isRefreshCall = original?.url?.includes('/auth/refresh') ?? false;

    // На протухший access (401) один раз обновляем токен и повторяем запрос.
    if (error.response?.status === 401 && original && !original._retried && !isRefreshCall) {
      original._retried = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Запрос пройдёт заново через request-интерсептор и подхватит свежий токен.
        return apiClient(original);
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
