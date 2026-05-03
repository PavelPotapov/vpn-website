import { Outlet } from 'react-router';

import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export default function SiteLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
