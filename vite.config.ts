import { readFileSync } from 'fs';
import path from 'path';

import { reactRouter } from '@react-router/dev/vite';
import svgr from '@svgr/rollup';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type PluginOption } from 'vite';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  plugins: [reactRouter(), tailwindcss(), svgr({ icon: true })],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: Number(process.env.VITE_DEV_PORT) || 5392,
    allowedHosts: true,
    hmr: {
      port: 5393,
    },
  },
  build: {
    sourcemap: 'hidden',
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
