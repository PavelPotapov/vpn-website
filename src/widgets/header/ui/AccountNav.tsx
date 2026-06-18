import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { Link } from 'react-router';

import { useAuthStore } from '@/features/auth';

import { useHydrated } from '@/shared/hooks';
import { useTranslation } from '@/shared/lib/i18n';
import { useLocalePath, useNavigate } from '@/shared/lib/navigation';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export function AccountNav() {
  const hydrated = useHydrated();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const clear = useAuthStore((s) => s.clear);

  // До гидрации не рендерим auth-зависимый UI — иначе SSR-мисматч
  if (!hydrated) return null;

  if (token === null) {
    return (
      <Button asChild className="rounded-xl" size="sm" variant="ghost">
        <Link to={lp('/account/login')}>{t('nav.login')}</Link>
      </Button>
    );
  }

  function handleLogout() {
    clear();
    navigate('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size="icon" variant="ghost">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={lp('/account')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {t('account.menu.cabinet')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {t('account.menu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
