import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';

import { cn } from '@/shared/lib';

type RowLabelData = {
  label: string;
  variant: 'danger' | 'safe';
};

const variantStyles = {
  danger: 'border-destructive/30 bg-destructive/8 text-destructive',
  safe: 'border-emerald-500/30 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400',
};

export const RowLabel = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as RowLabelData;
  const style = variantStyles[nodeData.variant] ?? variantStyles.danger;

  return (
    <div className={cn(
      'rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap',
      style,
    )}>
      {nodeData.label}
    </div>
  );
});
RowLabel.displayName = 'RowLabel';
