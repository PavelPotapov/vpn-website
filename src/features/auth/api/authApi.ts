import { apiClient } from '@/shared/api';

export interface TelegramStart {
  bot_link: string;
  expires_in: number;
  instruction: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

/** Начинает Telegram-авторизацию: возвращает deep-link на бота, где юзер получит код. */
export async function telegramStart(): Promise<TelegramStart> {
  const { data } = await apiClient.post<TelegramStart>('/api/v2/auth/telegram/start');
  return data;
}

/** Проверяет 6-значный код из бота и возвращает JWT-токены. */
export async function telegramVerify(code: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/api/v2/auth/telegram/verify', { code });
  return data;
}
