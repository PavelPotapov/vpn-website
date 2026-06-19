import type { IncomingMessage } from 'http';

import { createRequestHandler } from '@react-router/express';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import nodemailer from 'nodemailer';

const BACKEND_URL = process.env.BACKEND_URL ?? 'https://imoproxy.duckdns.org';

// ── httpOnly-куки с токенами (BFF) ───────────────────────────────────────────
// Токены живут в куках, JS их прочитать НЕ может (защита от XSS). Сервер сам
// подставляет access в запросы к бэкенду и обновляет токены. vpn_auth — читаемый
// JS флаг "залогинен", без секретов, только для состояния UI.
const AT_COOKIE = 'vpn_at';
const RT_COOKIE = 'vpn_rt';
const FLAG_COOKIE = 'vpn_auth';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 дней (= refresh TTL)

// secure НЕ ставим: сайт пока на http. Когда повесим домен+TLS — добавить secure:true.
const tokenCookieOpts = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: COOKIE_MAX_AGE,
};
const flagCookieOpts = { ...tokenCookieOpts, httpOnly: false };

function parseCookies(req: IncomingMessage): Record<string, string> {
  const raw = req.headers.cookie;
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const part of raw.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

function setAuthCookies(res: express.Response, accessToken: string, refreshToken: string) {
  res.cookie(AT_COOKIE, accessToken, tokenCookieOpts);
  res.cookie(RT_COOKIE, refreshToken, tokenCookieOpts);
  res.cookie(FLAG_COOKIE, '1', flagCookieOpts);
}

function clearAuthCookies(res: express.Response) {
  res.clearCookie(AT_COOKIE, { path: '/' });
  res.clearCookie(RT_COOKIE, { path: '/' });
  res.clearCookie(FLAG_COOKIE, { path: '/' });
}

async function backendPost(path: string, body: unknown) {
  const r = await fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await r.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: r.ok, status: r.status, data };
}

// BFF-роуты входа: получают токены от бэкенда server-to-server и кладут в куки.
function mountBffAuth(app: express.Express) {
  const json = express.json();

  // Завершение входа (issue токенов) — ставим куки, токены в браузер НЕ отдаём.
  async function finishLogin(path: string, body: unknown, res: express.Response) {
    const { ok, status, data } = await backendPost(path, body);
    if (!ok || typeof data.access_token !== 'string' || typeof data.refresh_token !== 'string') {
      res.status(ok ? 502 : status).json(data);
      return;
    }
    setAuthCookies(res, data.access_token, data.refresh_token);
    res.json({ ok: true });
  }

  app.post('/bff/auth/email/verify', json, async (req, res) => {
    const { email, code } = req.body ?? {};
    await finishLogin('/api/v2/auth/email/verify', { email, code }, res);
  });

  app.post('/bff/auth/telegram/verify', json, async (req, res) => {
    const { code } = req.body ?? {};
    await finishLogin('/api/v2/auth/telegram/verify', { code }, res);
  });

  app.post('/bff/auth/link-code/verify', json, async (req, res) => {
    const { code } = req.body ?? {};
    await finishLogin('/api/v2/auth/link-code/verify', { code }, res);
  });

  // Обновление токена по refresh-куке.
  app.post('/bff/auth/refresh', async (req, res) => {
    const rt = parseCookies(req)[RT_COOKIE];
    if (!rt) {
      clearAuthCookies(res);
      res.status(401).json({ error: 'no session' });
      return;
    }
    const { ok, data } = await backendPost('/api/v2/auth/refresh', { refresh_token: rt });
    if (!ok || typeof data.access_token !== 'string' || typeof data.refresh_token !== 'string') {
      clearAuthCookies(res);
      res.status(401).json({ error: 'refresh failed' });
      return;
    }
    setAuthCookies(res, data.access_token, data.refresh_token);
    res.json({ ok: true });
  });

  // Выход — отзываем серверную сессию по refresh-куке и чистим куки.
  app.post('/bff/auth/logout', async (req, res) => {
    const rt = parseCookies(req)[RT_COOKIE];
    if (rt) {
      try {
        await backendPost('/api/v2/auth/logout', { refresh_token: rt });
      } catch {
        // не критично — куки всё равно чистим
      }
    }
    clearAuthCookies(res);
    res.json({ ok: true });
  });
}

// Проксируем /api/* на бэкенд (браузер ходит только в свой origin — CORS не нужен).
// На исходящий запрос подставляем Authorization из httpOnly-куки: браузер токен не видит.
function mountApiProxy(app: express.Express) {
  app.use(
    createProxyMiddleware({
      pathFilter: '/api',
      target: BACKEND_URL,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) => {
          const at = parseCookies(req)[AT_COOKIE];
          if (at) proxyReq.setHeader('Authorization', `Bearer ${at}`);
        },
      },
    }),
  );
}

// Релей отправки писем. Бэкенд не может ходить по SMTP напрямую (хостер режет
// исходящий SMTP), а этот VPS — может. Бэкенд шлёт сюда POST по сети, мы
// отправляем письмо через Яндекс. Включается только если заданы секрет и SMTP.
function mountEmailRelay(app: express.Express) {
  const secret = process.env.RELAY_SECRET;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  const port = Number(process.env.SMTP_PORT) || 465;

  if (!secret || !host || !user || !pass || !from) return;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // implicit TLS на 465; на 587 — STARTTLS
    auth: { user, pass },
  });

  app.post('/internal/send-email', express.json(), async (req, res) => {
    if (req.headers.authorization !== `Bearer ${secret}`) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    const { to, subject, body } = req.body ?? {};
    if (!to || !subject || !body) {
      res.status(400).json({ error: 'to, subject and body are required' });
      return;
    }
    try {
      await transporter.sendMail({ from, to, subject, text: body });
      res.json({ status: 'sent' });
    } catch (err) {
      console.error('relay send failed:', err);
      res.status(502).json({ error: 'send failed' });
    }
  });
}

function mountMiddleware(app: express.Express) {
  mountEmailRelay(app);
  mountBffAuth(app);
  mountApiProxy(app);
}

export function createApp() {
  const app = express();

  mountMiddleware(app);

  app.use(
    createRequestHandler({
      // @ts-expect-error — virtual module in dev, built output in prod
      build: () => import('virtual:react-router/server-build') as never,
      mode: process.env.NODE_ENV,
    }),
  );

  return app;
}

export function createProdApp(build: unknown) {
  const app = express();

  mountMiddleware(app);

  app.use(
    createRequestHandler({
      build: build as never,
      mode: 'production',
    }),
  );

  return app;
}
