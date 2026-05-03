import * as React from 'react';

import { cn } from '@/shared/lib';

interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  children: React.ReactNode;
}

export const NeonCard = React.forwardRef<HTMLDivElement, NeonCardProps>(
  ({ className, glowColor = 'var(--primary)', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('neon-card group relative overflow-hidden rounded-2xl h-full', className)}
        style={{ '--neon-color': glowColor } as React.CSSProperties}
        {...props}
      >
        {/* Animated border */}
        <div className="neon-card-border pointer-events-none absolute inset-0 rounded-2xl" />

        {/* Inner glow on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), color-mix(in srgb, ${glowColor} 6%, transparent), transparent 40%)`,
          }}
        />

        {/* Content */}
        <div className="bg-card relative h-full rounded-2xl border border-transparent">
          {children}
        </div>
      </div>
    );
  },
);
NeonCard.displayName = 'NeonCard';
