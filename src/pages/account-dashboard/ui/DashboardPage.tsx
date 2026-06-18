import { useEffect, useState } from 'react';

import { apiClient, AUTH_TOKEN_KEY } from '@/shared/api';
import { useTranslation } from '@/shared/lib/i18n';
import { useNavigate } from '@/shared/lib/navigation';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface Me {
  user_id: string;
  tier: string;
  plan?: string;
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

  const [me, setMe] = useState<Me | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [deviceList, setDeviceList] = useState<DeviceList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const meRes = await apiClient.get<Me>('/api/v2/me');
      setMe(meRes.data);

      const devRes = await apiClient.get<DeviceList>('/api/v2/devices');
      setDeviceList(devRes.data);

      try {
        const subRes = await apiClient.get<Subscription>('/api/v2/subscription');
        setSubscription(subRes.data);
      } catch {
        setSubscription(null);
      }
    } catch {
      setError(t('account.dashboard.loadError'));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (token === null) {
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

  if (isLoading) {
    return (
      <div className="text-muted-foreground p-8 text-center">{t('account.dashboard.loading')}</div>
    );
  }

  if (error !== null) {
    return <div className="text-destructive p-8 text-center">{error}</div>;
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
    </div>
  );
}
