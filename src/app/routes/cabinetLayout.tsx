import { Outlet } from 'react-router';

import { CabinetHeader } from '@/widgets/cabinet-header';

export default function CabinetLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <CabinetHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
