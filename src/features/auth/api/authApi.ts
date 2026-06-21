import { apiClient } from '@/shared/api';

export interface TelegramStart {
  bot_link: string;
  expires_in: number;
  instruction: string;
}

/** Telegram-вход, шаг 1: deep-link на бота (публичный, без токенов). */
export async function telegramStart(): Promise<TelegramStart> {
  const { data } = await apiClient.post<TelegramStart>('/api/v2/auth/telegram/start');
  return data;
}

/** Telegram-вход, шаг 2: код из бота. Токены сервер кладёт в httpOnly-куки. */
export async function telegramVerify(code: string): Promise<void> {
  await apiClient.post('/bff/auth/telegram/verify', { code });
}

/** Email-вход, шаг 1: код на почту (публичный, без токенов). */
export async function emailStart(email: string): Promise<void> {
  await apiClient.post('/api/v2/auth/email/start', { email });
}

/** Email-вход, шаг 2: код из письма. Токены — в httpOnly-куки. */
export async function emailVerify(email: string, code: string): Promise<void> {
  await apiClient.post('/bff/auth/email/verify', { email, code });
}

/** Выход: сервер отзывает сессию и чистит куки. */
export async function logout(): Promise<void> {
  await apiClient.post('/bff/auth/logout');
}

/** Выйти на всех устройствах (отзыв всех сессий пользователя). */
export async function logoutAll(): Promise<void> {
  await apiClient.post('/api/v2/auth/logout-all');
}

/** Удалить аккаунт навсегда (отзыв туннелей + удаление данных). */
export async function deleteAccount(): Promise<void> {
  await apiClient.delete('/api/v2/me');
}

// ── Привязка identity к текущему аккаунту ──

/** Привязка почты, шаг 1: код на новый email. */
export async function emailLinkStart(email: string): Promise<void> {
  await apiClient.post('/api/v2/identities/email/link/start', { email });
}

/** Привязка почты, шаг 2: код из письма. Возвращает status: linked|already|merged. */
export async function emailLinkVerify(code: string): Promise<{ status: string }> {
  const { data } = await apiClient.post<{ status: string }>(
    '/api/v2/identities/email/link/verify',
    { code },
  );
  return data;
}

/** Привязка Telegram: deep-link на бота, привязанный к текущему аккаунту. */
export async function telegramLinkStart(): Promise<{ bot_link: string }> {
  const { data } = await apiClient.post<{ bot_link: string }>(
    '/api/v2/identities/telegram/link/start',
  );
  return data;
}
