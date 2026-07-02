import { useState } from 'react';

import { apiClient, isApiError } from '@/shared/api';
import { useTranslation } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

interface RedeemResult {
  plan: string;
  days: number;
  expires_at: string;
}

interface RedeemCodeCardProps {
  onChanged: () => void;
}

export function RedeemCodeCard({ onChanged }: RedeemCodeCardProps) {
  const { t } = useTranslation();

  const [code, setCode] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRedeem() {
    const trimmed = code.trim();
    if (trimmed === '' || isBusy) return;

    setIsBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const { data } = await apiClient.post<RedeemResult>('/api/v2/codes/redeem', {
        code: trimmed,
      });
      setSuccess(
        t('account.dashboard.redeemSuccess', {
          plan: data.plan,
          date: new Date(data.expires_at).toLocaleDateString(),
        }),
      );
      setCode('');
      onChanged();
    } catch (err) {
      if (isApiError(err) && err.statusCode === 404) {
        setError(t('account.dashboard.redeemErrNotFound'));
      } else if (isApiError(err) && err.statusCode === 409) {
        setError(t('account.dashboard.redeemErrUsed'));
      } else if (isApiError(err) && err.statusCode === 400) {
        setError(t('account.dashboard.redeemErrInvalid'));
      } else {
        setError(t('account.dashboard.redeemErrGeneric'));
      }
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('account.dashboard.redeemTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">{t('account.dashboard.redeemHint')}</p>
        <div className="flex gap-2">
          <Input
            value={code}
            placeholder={t('account.dashboard.redeemPlaceholder')}
            className="font-mono uppercase"
            autoComplete="off"
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleRedeem();
            }}
          />
          <Button disabled={isBusy || code.trim() === ''} onClick={() => void handleRedeem()}>
            {isBusy ? t('account.dashboard.redeemWait') : t('account.dashboard.redeemSubmit')}
          </Button>
        </div>
        {error !== null && <p className="text-destructive text-sm">{error}</p>}
        {success !== null && <p className="text-sm text-green-600">{success}</p>}
      </CardContent>
    </Card>
  );
}
