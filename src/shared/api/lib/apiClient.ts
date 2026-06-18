import axios, { type AxiosError } from 'axios';

import { createApiError } from './apiError';

/** Ключ localStorage для access-токена (единый источник правды для авторизации). */
export const AUTH_TOKEN_KEY = 'vpn-auth-token';

/**
 * Настроенный инстанс Axios. Запросы идут в свой origin под `/api`, который
 * Express-сервер проксирует на бэкенд (поэтому CORS не нужен). Bearer-токен
 * читается из localStorage на каждый запрос.
 */
export const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    throw createApiError({
      statusCode: error.response?.status ?? null,
      url: error.config?.url ?? '',
      method: error.config?.method ?? '',
      message: error.response?.data?.error ?? error.message ?? 'Request failed',
      raw: error,
    });
  },
);
