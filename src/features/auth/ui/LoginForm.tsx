import { useState } from 'react';

import { useTranslation } from '@/shared/lib/i18n';
import { useNavigate } from '@/shared/lib/navigation';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import {
  emailStart,
  emailVerify,
  telegramStart,
  telegramVerify,
  type TelegramStart,
} from '../api/authApi';
import { useAuthStore } from '../model/authStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Telegram
  const [start, setStart] = useState<TelegramStart | null>(null);
  const [code, setCode] = useState('');

  // Email
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailCode, setEmailCode] = useState('');

  function resetError() {
    setError(null);
  }

  async function handleTelegramStart() {
    setIsLoading(true);
    resetError();
    try {
      setStart(await telegramStart());
    } catch {
      setError(t('account.login.startError'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTelegramVerify() {
    setIsLoading(true);
    resetError();
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

  async function handleEmailStart() {
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setError(t('account.login.emailInvalid'));
      return;
    }
    setIsLoading(true);
    resetError();
    try {
      await emailStart(value);
      setEmail(value);
      setEmailSent(true);
    } catch {
      setError(t('account.login.startError'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEmailVerify() {
    setIsLoading(true);
    resetError();
    try {
      const tokens = await emailVerify(email, emailCode.trim());
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
      <CardContent>
        <Tabs defaultValue="telegram" onValueChange={resetError}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="telegram">{t('account.login.tabTelegram')}</TabsTrigger>
            <TabsTrigger value="email">{t('account.login.tabEmail')}</TabsTrigger>
          </TabsList>

          <TabsContent value="telegram" className="space-y-4 pt-4">
            {start === null ? (
              <Button className="w-full" disabled={isLoading} onClick={handleTelegramStart}>
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
                  onClick={handleTelegramVerify}
                >
                  {isLoading ? t('account.login.checking') : t('account.login.confirm')}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4 pt-4">
            {!emailSent ? (
              <div className="space-y-4">
                <Input
                  autoComplete="email"
                  inputMode="email"
                  placeholder={t('account.login.email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleEmailStart();
                  }}
                />
                <Button
                  className="w-full"
                  disabled={isLoading || email.trim().length === 0}
                  onClick={handleEmailStart}
                >
                  {isLoading ? t('account.login.wait') : t('account.login.emailSend')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {t('account.login.emailSent', { email })}
                </p>
                <Input
                  inputMode="numeric"
                  placeholder={t('account.login.emailCode')}
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleEmailVerify();
                  }}
                />
                <Button
                  className="w-full"
                  disabled={isLoading || emailCode.trim().length === 0}
                  onClick={handleEmailVerify}
                >
                  {isLoading ? t('account.login.checking') : t('account.login.confirm')}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {error !== null && <p className="text-destructive mt-4 text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
}
