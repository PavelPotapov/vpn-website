import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { AppErrorBoundary } from './.infra/errorHandling';

import './.infra/i18n';

import './theme/globals.css';

const themeInitScript = `(function(){try{var t=localStorage.getItem('vpn-theme')||'system';var d=t==='system'?window.matchMedia('(prefers-color-scheme:dark)').matches:t==='dark';document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <title>VPN — Fast & Secure</title>
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <AppErrorBoundary>
      <Outlet />
    </AppErrorBoundary>
  );
}

export function ErrorBoundary() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Something went wrong</h1>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
}
