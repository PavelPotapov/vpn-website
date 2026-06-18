import { useAuthStore } from '@/features/auth';

import { useNavigate } from '@/shared/lib/navigation';
import { Button } from '@/shared/ui/button';

export function CabinetHeader() {
  const navigate = useNavigate();
  const clear = useAuthStore((s) => s.clear);

  function handleLogout() {
    clear();
    navigate('/account/login');
  }

  return (
    <header className="border-border flex items-center justify-between border-b px-4 py-3 md:px-8">
      <span className="font-semibold">Личный кабинет</span>
      <Button size="sm" variant="ghost" onClick={handleLogout}>
        Выйти
      </Button>
    </header>
  );
}
