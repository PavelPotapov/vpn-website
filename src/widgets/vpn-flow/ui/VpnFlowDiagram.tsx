import { type ComponentType } from 'react';
import { motion, type Variants } from 'motion/react';
import {
  Smartphone, Building2, ScanSearch, Ban,
  ShieldCheck, Lock, Server, Globe, Eye,
} from 'lucide-react';

import { useTranslation } from '@/shared/lib/i18n';

type CardVariant = 'neutral' | 'warning' | 'danger' | 'safe' | 'success' | 'info';

const vs: Record<CardVariant, { card: string; icon: string }> = {
  neutral: {
    card: 'border-blue-200/70 bg-blue-50/50 dark:border-blue-800/40 dark:bg-blue-950/30',
    icon: 'text-blue-500 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40',
  },
  warning: {
    card: 'border-amber-300/70 bg-amber-50/50 dark:border-amber-700/40 dark:bg-amber-950/30',
    icon: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/40',
  },
  danger: {
    card: 'border-red-300/70 bg-red-50/50 dark:border-red-800/40 dark:bg-red-950/30',
    icon: 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/40',
  },
  safe: {
    card: 'border-emerald-200/70 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-950/30',
    icon: 'text-emerald-500 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40',
  },
  success: {
    card: 'border-emerald-300/70 bg-emerald-50/70 dark:border-emerald-700/50 dark:bg-emerald-950/40',
    icon: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/50',
  },
  info: {
    card: 'border-violet-200/70 bg-violet-50/50 dark:border-violet-800/40 dark:bg-violet-950/30',
    icon: 'text-violet-500 bg-violet-100 dark:text-violet-400 dark:bg-violet-900/40',
  },
};

const lineTextColor: Record<string, string> = {
  blue: 'text-blue-300 dark:text-blue-600',
  red: 'text-red-300 dark:text-red-600',
  green: 'text-emerald-300 dark:text-emerald-600',
};

const cardV: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const connV: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: { scaleY: 1, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

const branchV: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const colV: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

function FlowCard({
  icon: Icon,
  title,
  description,
  variant,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  variant: CardVariant;
}) {
  const s = vs[variant];
  return (
    <motion.div variants={cardV} className={`rounded-2xl border p-5 ${s.card}`}>
      <div className="flex gap-4">
        <div className={`shrink-0 self-start rounded-xl p-2.5 ${s.icon}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold leading-snug">{title}</h4>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Connector({ color }: { color: string }) {
  return (
    <motion.div
      variants={connV}
      className="flex justify-center py-1"
      style={{ transformOrigin: 'top' }}
    >
      <svg width="2" height="32" className={lineTextColor[color]}>
        <line
          x1="1" y1="0" x2="1" y2="32"
          stroke="currentColor" strokeWidth="2"
          strokeDasharray="6 6"
          className="animate-flow-down"
        />
      </svg>
    </motion.div>
  );
}

export function VpnFlowDiagram() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* ── Without VPN ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={colV}
      >
        <motion.div variants={cardV} className="mb-6">
          <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-600 dark:border-red-800/40 dark:bg-red-950/40 dark:text-red-400">
            {t('flow.withoutVpn')}
          </span>
        </motion.div>

        <FlowCard variant="neutral" icon={Smartphone}
          title={t('flow.noVpnDevice')} description={t('flow.noVpnDeviceDesc')} />
        <Connector color="blue" />

        <FlowCard variant="neutral" icon={Building2}
          title={t('flow.noVpnIsp')} description={t('flow.noVpnIspDesc')} />
        <Connector color="blue" />

        <FlowCard variant="warning" icon={ScanSearch}
          title={t('flow.noVpnDpi')} description={t('flow.noVpnDpiDesc')} />
        <Connector color="red" />

        <FlowCard variant="danger" icon={Ban}
          title={t('flow.noVpnBlocked')} description={t('flow.noVpnBlockedDesc')} />
      </motion.div>

      {/* ── With VPN ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={colV}
      >
        <motion.div variants={cardV} className="mb-6">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-600 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-400">
            {t('flow.withVpn')}
          </span>
        </motion.div>

        <FlowCard variant="safe" icon={ShieldCheck}
          title={t('flow.vpnDevice')} description={t('flow.vpnDeviceDesc')} />
        <Connector color="green" />

        <FlowCard variant="safe" icon={Lock}
          title={t('flow.vpnTunnel')} description={t('flow.vpnTunnelDesc')} />
        <Connector color="green" />

        <FlowCard variant="safe" icon={Building2}
          title={t('flow.vpnIsp')} description={t('flow.vpnIspDesc')} />
        <Connector color="green" />

        <FlowCard variant="safe" icon={ScanSearch}
          title={t('flow.vpnDpi')} description={t('flow.vpnDpiDesc')} />

        {/* Branch: protocol masquerading */}
        <motion.div variants={branchV} className="my-2 ml-8 flex items-stretch gap-3">
          <div className="w-0.5 shrink-0 rounded-full bg-violet-300 dark:bg-violet-700" />
          <div className={`flex-1 rounded-xl border p-4 ${vs.info.card}`}>
            <div className="flex gap-3">
              <div className={`shrink-0 self-start rounded-lg p-2 ${vs.info.icon}`}>
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{t('flow.vpnMasquerade')}</h4>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {t('flow.vpnMasqueradeDesc')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <Connector color="green" />

        <FlowCard variant="safe" icon={Server}
          title={t('flow.vpnServer')} description={t('flow.vpnServerDesc')} />
        <Connector color="green" />

        <FlowCard variant="success" icon={Globe}
          title={t('flow.vpnInternet')} description={t('flow.vpnInternetDesc')} />
      </motion.div>
    </div>
  );
}
