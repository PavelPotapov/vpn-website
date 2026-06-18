import { Outlet } from 'react-router';

import { Header } from '@/widgets/header';

export default function CabinetLayout() {
  // Кабинет использует общую шапку лендинга (без маркетингового футера)
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
