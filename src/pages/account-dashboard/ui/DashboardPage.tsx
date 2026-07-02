import { useEffect, useState } from 'react';

import { deleteAccount, logoutAll, useAuthStore } from '@/features/auth';

import { apiClient, isApiError } from '@/shared/api';
import { useTranslation } from '@/shared/lib/i18n';
import { useNavigate } from '@/shared/lib/navigation';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import { IdentitiesCard } from './IdentitiesCard';
import { RedeemCodeCard } from './RedeemCodeCard';

interface Me {
  user_id: string;
  tier: string;
  plan?: string;
  email?: string;
  telegram_username?: string;
}

interface Plan {
  name: string;
  max_devices: number;
}

interface Subscription {
  status: string;
  expires_at?: string;
  plan?: Plan;
}

interface Device {
  id: string;
  platform: string;
  connected: boolean;
  is_current: boolean;
  last_seen_at: string;
}

interface DeviceList {
  devices: Device[];
  count: number;
  max_devices: number;
}

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const setAuthed = useAuthStore((s) => s.setAuthed);
  const logoutLocal = useAuthStore((s) => s.logout);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const [me, setMe] = useState<Me | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [deviceList, setDeviceList] = useState<DeviceList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [codeSecondsLeft, setCodeSecondsLeft] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  async function load() {
    setIsLoading(true);
    setError(null);

    // /me — единственный обязательный запрос (проверка авторизации).
    try {
      const meRes = await apiClient.get<Me>('/api/v2/me');
      setMe(meRes.data);
    } catch (err) {
      if (isApiError(err) && err.statusCode === 401) {
        setAuthed(false);
        navigate('/account/login'); // сессия истекла и refresh не помог
        return;
      }
      setError(t('account.dashboard.loadError'));
      setIsLoading(false);
      return;
    }

    // Остальное необязательно: одна осечка не должна гасить весь дашборд.
    try {
      const devRes = await apiClient.get<DeviceList>('/api/v2/devices');
      setDeviceList(devRes.data);
    } catch {
      setDeviceList(null);
    }
    try {
      const subRes = await apiClient.get<Subscription>('/api/v2/subscription');
      setSubscription(subRes.data);
    } catch {
      setSubscription(null);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (!isAuthed) {
      navigate('/account/login');
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUnlink(id: string) {
    try {
      await apiClient.delete(`/api/v2/devices/${id}`);
      await load();
    } catch {
      // игнорируем — список обновится на следующей загрузке
    }
  }

  // Тикаем обратный отсчёт кода привязки; на нуле код просто перестаёт показываться.
  useEffect(() => {
    if (codeSecondsLeft <= 0) return;
    const id = setTimeout(() => setCodeSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [codeSecondsLeft]);

  async function handleGenerateCode() {
    setIsGenerating(true);
    try {
      const { data } = await apiClient.post<{ code: string; expires_in: number }>(
        '/api/v2/auth/link-code/create',
      );
      setLinkCode(data.code);
      setCodeSecondsLeft(data.expires_in);
    } catch {
      // no-op — пользователь может нажать снова
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleLogoutAll() {
    setIsBusy(true);
    try {
      await logoutAll();
    } catch {
      // даже если не прошло — всё равно выходим локально
    }
    await logoutLocal();
    navigate('/');
  }

  async function handleDelete() {
    setIsBusy(true);
    try {
      await deleteAccount();
    } catch {
      setIsBusy(false);
      return; // остаёмся на странице
    }
    await logoutLocal();
    navigate('/');
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground p-8 text-center">{t('account.dashboard.loading')}</div>
    );
  }

  if (error !== null) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-8 text-center">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => void load()}>{t('account.dashboard.retry')}</Button>
      </div>
    );
  }

  const planName = subscription?.plan?.name ?? me?.plan ?? 'Free';
  const isActive = subscription?.status === 'active';

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('account.dashboard.subscription')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge>{planName}</Badge>
            <span className="text-sm">
              {isActive ? t('account.dashboard.active') : t('account.dashboard.inactive')}
            </span>
          </div>
          {subscription?.plan && (
            <p className="text-muted-foreground text-sm">
              {t('account.dashboard.upToDevices', {
                count: subscription.plan.max_devices,
              })}
            </p>
          )}
          {subscription?.expires_at && (
            <p className="text-muted-foreground text-sm">
              {t('account.dashboard.validUntil', {
                date: new Date(subscription.expires_at).toLocaleDateString(),
              })}
            </p>
          )}
        </CardContent>
      </Card>

      <RedeemCodeCard onChanged={() => void load()} />

      <Card>
        <CardHeader>
          <CardTitle>
            {t('account.dashboard.devices')}
            {deviceList ? ` (${deviceList.count}/${deviceList.max_devices})` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {deviceList && deviceList.devices.length > 0 ? (
            deviceList.devices.map((d) => (
              <div key={d.id} className="flex items-center justify-between">
                <div>
                  <span className="font-medium capitalize">{d.platform}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {d.connected
                      ? t('account.dashboard.connected')
                      : t('account.dashboard.notConnected')}
                    {d.is_current ? ` · ${t('account.dashboard.thisDevice')}` : ''}
                  </span>
                </div>
                {!d.is_current && (
                  <Button size="sm" variant="ghost" onClick={() => handleUnlink(d.id)}>
                    {t('account.dashboard.unlink')}
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">{t('account.dashboard.noDevices')}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('account.dashboard.appLogin')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">{t('account.dashboard.appLoginHint')}</p>
          {linkCode !== null && codeSecondsLeft > 0 && (
            <div className="space-y-1">
              <div className="font-mono text-3xl tracking-widest">{linkCode}</div>
              <p className="text-muted-foreground text-xs">
                {t('account.dashboard.appLoginExpires', {
                  time: `${Math.floor(codeSecondsLeft / 60)}:${String(codeSecondsLeft % 60).padStart(2, '0')}`,
                })}
              </p>
            </div>
          )}
          <Button disabled={isGenerating} onClick={handleGenerateCode}>
            {isGenerating
              ? t('account.dashboard.appLoginWait')
              : linkCode !== null && codeSecondsLeft > 0
                ? t('account.dashboard.appLoginRegenerate')
                : t('account.dashboard.appLoginGenerate')}
          </Button>
        </CardContent>
      </Card>

      <IdentitiesCard
        email={me?.email}
        telegramUsername={me?.telegram_username}
        onChanged={() => void load()}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('account.dashboard.dangerZone')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Button variant="outline" disabled={isBusy} onClick={() => void handleLogoutAll()}>
              {t('account.dashboard.logoutAll')}
            </Button>
          </div>
          {!confirmDelete ? (
            <Button variant="destructive" disabled={isBusy} onClick={() => setConfirmDelete(true)}>
              {t('account.dashboard.deleteAccount')}
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-destructive text-sm">{t('account.dashboard.deleteConfirm')}</p>
              <div className="flex gap-2">
                <Button variant="destructive" disabled={isBusy} onClick={() => void handleDelete()}>
                  {t('account.dashboard.deleteYes')}
                </Button>
                <Button variant="ghost" disabled={isBusy} onClick={() => setConfirmDelete(false)}>
                  {t('account.dashboard.cancel')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
