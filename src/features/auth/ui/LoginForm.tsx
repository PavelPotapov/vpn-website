import { useState } from 'react';

import { useTranslation } from '@/shared/lib/i18n';
import { useNavigate } from '@/shared/lib/navigation';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

import { telegramStart, telegramVerify, type TelegramStart } from '../api/authApi';
import { useAuthStore } from '../model/authStore';

export function LoginForm() {
  const { t } = useTranslation();
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
      setError(t('account.login.startError'));
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
      setError(t('account.login.codeError'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('account.login.title')}</CardTitle>
        <CardDescription>{t('account.login.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {start === null ? (
          <Button className="w-full" disabled={isLoading} onClick={handleStart}>
            {isLoading ? t('account.login.wait') : t('account.login.telegram')}
          </Button>
        ) : (
          <div className="space-y-4">
            <a className="block" href={start.bot_link} rel="noreferrer" target="_blank">
              <Button className="w-full" variant="secondary">
                {t('account.login.openBot')}
              </Button>
            </a>
            <p className="text-muted-foreground text-sm">{start.instruction}</p>
            <Input
              inputMode="numeric"
              placeholder={t('account.login.code')}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              className="w-full"
              disabled={isLoading || code.trim().length === 0}
              onClick={handleVerify}
            >
              {isLoading ? t('account.login.checking') : t('account.login.confirm')}
            </Button>
          </div>
        )}
        {error !== null && <p className="text-destructive text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
}
