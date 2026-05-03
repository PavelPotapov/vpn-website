import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Smartphone,
  Shield,
  ShieldOff,
  ShieldCheck,
  Server,
  Globe,
  Lock,
  LockOpen,
  Eye,
  Ban,
  Wifi,
} from 'lucide-react';

import { cn } from '@/shared/lib';

type FlowNodeData = {
  label: string;
  icon: string;
  variant: 'default' | 'primary' | 'accent' | 'blocked' | 'success';
  description?: string;
};

const icons: Record<string, typeof Shield> = {
  smartphone: Smartphone,
  shield: Shield,
  shieldOff: ShieldOff,
  shieldCheck: ShieldCheck,
  server: Server,
  globe: Globe,
  lock: Lock,
  lockOpen: LockOpen,
  eye: Eye,
  ban: Ban,
  wifi: Wifi,
};

const variantStyles = {
  default: {
    container: 'border-border/60 bg-card',
    icon: 'bg-muted text-foreground',
  },
  primary: {
    container: 'border-primary/40 bg-card',
    icon: 'bg-primary/10 text-primary',
  },
  accent: {
    container: 'border-accent/40 bg-card',
    icon: 'bg-accent/10 text-accent',
  },
  blocked: {
    container: 'border-destructive/40 bg-destructive/5',
    icon: 'bg-destructive/10 text-destructive',
  },
  success: {
    container: 'border-emerald-500/40 bg-emerald-500/5',
    icon: 'bg-emerald-500/10 text-emerald-500',
  },
};

export const FlowNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as FlowNodeData;
  const Icon = icons[nodeData.icon] ?? Shield;
  const styles = variantStyles[nodeData.variant] ?? variantStyles.default;

  return (
    <>
      <Handle type="target" position={Position.Left} className="!border-none !bg-transparent !h-1 !w-1" />

      <div className={cn(
        'flex flex-col items-center gap-1 rounded-xl border px-4 py-3 shadow-sm min-w-[120px] max-w-[160px]',
        styles.container,
      )}>
        <div className={cn('rounded-lg p-2.5', styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold text-center leading-tight">{nodeData.label}</span>
        {nodeData.description && (
          <span className="text-[10px] text-muted-foreground text-center leading-tight mt-0.5">
            {nodeData.description}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!border-none !bg-transparent !h-1 !w-1" />
    </>
  );
});
FlowNode.displayName = 'FlowNode';
