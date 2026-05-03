import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'src/app',
  ssr: true,
  prerender: [
    '/',
    '/ru/',
    '/pricing/',
    '/ru/pricing/',
    '/features/',
    '/ru/features/',
  ],
} satisfies Config;
