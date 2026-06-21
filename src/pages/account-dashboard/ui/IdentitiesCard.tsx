import { useState } from 'react';

import { emailLinkStart, emailLinkVerify, telegramLinkStart } from '@/features/auth';

import { isApiError } from '@/shared/api';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  email?: string;
  telegramUsername?: string;
  onChanged: () => void;
}

export function IdentitiesCard({ email, telegramUsername, onChanged }: Props) {
  const { t } = useTranslation();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Telegram
  const [tgOpened, setTgOpened] = useState(false);

  // Email
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCode, setEmailCode] = useState('');

  async function handleLinkTelegram() {
    setBusy(true);
    setError(null);
    try {
      const { bot_link } = await telegramLinkStart();
      window.open(bot_link, '_blank', 'noopener');
      setTgOpened(true);
    } catch {
      setError(t('account.identities.error'));
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailStart() {
    const value = emailValue.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setError(t('account.identities.emailInvalid'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await emailLinkStart(value);
      setEmailValue(value);
      setEmailCodeSent(true);
    } catch (err) {
      if (isApiError(err) && err.statusCode === 409) {
        setError(t('account.identities.emailTaken'));
      } else {
        setError(t('account.identities.error'));
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailVerify() {
    setBusy(true);
    setError(null);
    try {
      const { status } = await emailLinkVerify(emailCode.trim());
      if (status === 'collision') {
        setError(t('account.identities.collision'));
        return;
      }
      resetEmail();
      onChanged();
    } catch (err) {
      if (isApiError(err) && err.statusCode === 409) {
        setError(t('account.identities.collision'));
      } else {
        setError(t('account.identities.codeError'));
      }
    } finally {
      setBusy(false);
    }
  }

  function resetEmail() {
    setEmailOpen(false);
    setEmailCodeSent(false);
    setEmailValue('');
    setEmailCode('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('account.identities.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Telegram */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm">
            <span className="font-medium">Telegram</span>
            <span className="text-muted-foreground ml-2">
              {telegramUsername ? `@${telegramUsername}` : t('account.identities.notLinked')}
            </span>
          </div>
          {!telegramUsername &&
            (tgOpened ? (
              <Button size="sm" variant="outline" disabled={busy} onClick={onChanged}>
                {t('account.identities.refresh')}
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled={busy} onClick={handleLinkTelegram}>
                {t('account.identities.link')}
              </Button>
            ))}
        </div>
        {tgOpened && !telegramUsername && (
          <p className="text-muted-foreground text-xs">{t('account.identities.tgHint')}</p>
        )}

        {/* Email */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm">
            <span className="font-medium">{t('account.identities.email')}</span>
            <span className="text-muted-foreground ml-2">
              {email ?? t('account.identities.notLinked')}
            </span>
          </div>
          {!email && !emailOpen && (
            <Button size="sm" variant="outline" disabled={busy} onClick={() => setEmailOpen(true)}>
              {t('account.identities.link')}
            </Button>
          )}
        </div>

        {!email && emailOpen && (
          <div className="space-y-2">
            {!emailCodeSent ? (
              <>
                <Input
                  type="email"
                  inputMode="email"
                  placeholder={t('account.identities.email')}
                  value={emailValue}
                  disabled={busy}
                  onChange={(e) => setEmailValue(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" disabled={busy} onClick={handleEmailStart}>
                    {t('account.identities.sendCode')}
                  </Button>
                  <Button size="sm" variant="ghost" disabled={busy} onClick={resetEmail}>
                    {t('account.identities.cancel')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Input
                  inputMode="numeric"
                  placeholder={t('account.identities.code')}
                  value={emailCode}
                  disabled={busy}
                  onChange={(e) => setEmailCode(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={busy || emailCode.trim().length === 0}
                    onClick={handleEmailVerify}
                  >
                    {t('account.identities.confirm')}
                  </Button>
                  <Button size="sm" variant="ghost" disabled={busy} onClick={resetEmail}>
                    {t('account.identities.cancel')}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {error !== null && <p className="text-destructive text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
}
