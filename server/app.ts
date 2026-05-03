import { createRequestHandler } from '@react-router/express';
import express from 'express';

export function createApp() {
  const app = express();

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

  app.use(
    createRequestHandler({
      build: build as never,
      mode: 'production',
    }),
  );

  return app;
}
