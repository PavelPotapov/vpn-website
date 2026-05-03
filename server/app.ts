import { createRequestHandler } from '@react-router/express';
import express from 'express';

export function createApp() {
  const app = express();

  app.use(
    createRequestHandler({
      // @ts-expect-error — virtual module, резолвится Vite в runtime
      build: () => import('virtual:react-router/server-build') as never,
      mode: process.env.NODE_ENV,
    }),
  );

  return app;
}
