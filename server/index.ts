import compression from 'compression';
import express from 'express';

const app = express();
app.use(compression());

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build/client', { maxAge: '1y', immutable: true }));
    app.use(express.static('build/client'));

    const { createApp } = await import('./app.js');
    app.use(createApp());
  } else {
    const viteModule = await import('vite');
    const vite = await viteModule.createServer({
      server: { middlewareMode: true },
    });

    app.use(vite.middlewares);

    app.use(async (req, res, next) => {
      try {
        const { createApp } = (await vite.ssrLoadModule(
          './server/app.ts',
        )) as typeof import('./app.js');
        const ssrApp = createApp();
        ssrApp(req, res, next);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  }

  const port = Number(process.env.PORT) || 5391;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
