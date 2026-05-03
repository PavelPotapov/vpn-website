import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/shared/lib';

interface AccordionItemProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function AccordionItem({ trigger, children, className, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn('border-border border-b', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-all hover:underline"
      >
        {trigger}
        <ChevronDown
          className={cn(
            'text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'mb-4 max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="text-muted-foreground pb-2 text-sm">{children}</div>
      </div>
    </div>
  );
}
