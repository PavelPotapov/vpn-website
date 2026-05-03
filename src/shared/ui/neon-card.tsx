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
        className={cn('neon-card group relative overflow-hidden rounded-2xl p-px h-full', className)}
        style={{ '--neon-color': glowColor } as React.CSSProperties}
        {...props}
      >
        {/* Animated border — fills entire area, visible only through 1px padding gap */}
        <div className="neon-card-border pointer-events-none absolute inset-0 rounded-[inherit]" />

        {/* Inner glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), color-mix(in srgb, ${glowColor} 6%, transparent), transparent 40%)`,
          }}
        />

        {/* Content — sits inside p-px, leaving 1px ring for the neon border */}
        <div className="bg-card relative h-full rounded-[inherit]">
          {children}
        </div>
      </div>
    );
  },
);
NeonCard.displayName = 'NeonCard';
