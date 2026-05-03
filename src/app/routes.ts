import { type RouteConfig, route, index, layout } from '@react-router/dev/routes';

export default [
  route(':locale?', 'routes/i18nLayout.tsx', [
    layout('routes/siteLayout.tsx', [
      index('routes/home.tsx'),
      route('pricing', 'routes/pricing.tsx'),
      route('features', 'routes/features.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
