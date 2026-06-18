import { createRequestHandler } from '@react-router/express';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

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

export function createApp() {
  const app = express();

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

  mountApiProxy(app);

  app.use(
    createRequestHandler({
      build: build as never,
      mode: 'production',
    }),
  );

  return app;
}
