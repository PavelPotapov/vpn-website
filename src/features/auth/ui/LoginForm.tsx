import { useState } from 'react';

import { useNavigate } from '@/shared/lib/navigation';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

import { telegramStart, telegramVerify, type TelegramStart } from '../api/authApi';
import { useAuthStore } from '../model/authStore';

export function LoginForm() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  const [start, setStart] = useState<TelegramStart | null>(null);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setIsLoading(true);
    setError(null);
    try {
      setStart(await telegramStart());
    } catch {
      setError('Не удалось начать вход. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify() {
    setIsLoading(true);
    setError(null);
    try {
      const tokens = await telegramVerify(code.trim());
      setToken(tokens.access_token);
      navigate('/account');
    } catch {
      setError('Неверный или истёкший код.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Вход в личный кабинет</CardTitle>
        <CardDescription>Авторизация через Telegram</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {start === null ? (
          <Button className="w-full" disabled={isLoading} onClick={handleStart}>
            {isLoading ? 'Подождите…' : 'Войти через Telegram'}
          </Button>
        ) : (
          <div className="space-y-4">
            <a className="block" href={start.bot_link} rel="noreferrer" target="_blank">
              <Button className="w-full" variant="secondary">
                Открыть Telegram-бота
              </Button>
            </a>
            <p className="text-muted-foreground text-sm">{start.instruction}</p>
            <Input
              inputMode="numeric"
              placeholder="Код из бота"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              className="w-full"
              disabled={isLoading || code.trim().length === 0}
              onClick={handleVerify}
            >
              {isLoading ? 'Проверка…' : 'Подтвердить код'}
            </Button>
          </div>
        )}
        {error !== null && <p className="text-destructive text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
}
