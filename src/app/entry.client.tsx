import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

import { showFatalError } from './.infra/errorHandling';
import { igniteApp } from './ignite';

try {
  igniteApp();
} catch (err) {
  showFatalError('igniteApp', err);
}

try {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  });
} catch (err) {
  showFatalError('hydrateRoot', err);
}

const CHUNK_ERROR_KEY = 'chunkErrorCount';
const MAX_CHUNK_RETRIES = 3;

window.addEventListener('vite:preloadError', (e) => {
  e.preventDefault();
  const count = Number(sessionStorage.getItem(CHUNK_ERROR_KEY) || '0') + 1;
  sessionStorage.setItem(CHUNK_ERROR_KEY, String(count));
  if (count < MAX_CHUNK_RETRIES) {
    window.location.reload();
  } else {
    sessionStorage.removeItem(CHUNK_ERROR_KEY);
    showFatalError('vite:preloadError', e);
  }
});

window.addEventListener('load', () => {
  sessionStorage.removeItem(CHUNK_ERROR_KEY);
});
