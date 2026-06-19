import { createRequestHandler } from '@react-router/express';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import nodemailer from 'nodemailer';

// Проксируем /api/* на бэкенд, чтобы браузер ходил только в свой origin
// (CORS не нужен). Адрес задаётся через BACKEND_URL; по умолчанию — прод.
function mountApiProxy(app: express.Express) {
  app.use(
    createProxyMiddleware({
      pathFilter: '/api',
      target: process.env.BACKEND_URL ?? 'https://imoproxy.duckdns.org',
      changeOrigin: true,
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

export function createApp() {
  const app = express();

  mountEmailRelay(app);
  mountApiProxy(app);

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

  mountEmailRelay(app);
  mountApiProxy(app);

  app.use(
    createRequestHandler({
      build: build as never,
      mode: 'production',
    }),
  );

  return app;
}
