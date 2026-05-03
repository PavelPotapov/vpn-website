import { createContext, type ReactNode, useCallback, useContext, useRef, useSyncExternalStore } from 'react';
import { motion, type Variant } from 'motion/react';

const SkipAnimationCtx = createContext(false);

type AnimationPreset = 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right';

const STORAGE_PREFIX = 'anim:';

function wasSeen(id: string): boolean {
  try {
    return sessionStorage.getItem(STORAGE_PREFIX + id) === '1';
  } catch {
    return false;
  }
}

function markSeen(id: string): void {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + id, '1');
  } catch {
    /* quota exceeded or SSR — ignore */
  }
}

const subscribe = () => () => {};
function useHasBeenSeen(id: string | undefined): boolean {
  return useSyncExternalStore(
    subscribe,
    () => (id ? wasSeen(id) : false),
    () => false,
  );
}

interface AnimateOnScrollProps {
  children: ReactNode;
  id?: string;
  preset?: AnimationPreset;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const presets: Record<AnimationPreset, { hidden: Variant; visible: Variant }> = {
  'fade-up': {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'scale-in': {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
};

export function AnimateOnScroll({
  children,
  id,
  preset = 'fade-up',
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  amount = 0.15,
}: AnimateOnScrollProps) {
  const { hidden, visible } = presets[preset];
  const alreadySeen = useHasBeenSeen(id);
  const markedRef = useRef(false);

  const onVisible = useCallback(() => {
    if (id && !markedRef.current) {
      markedRef.current = true;
      markSeen(id);
    }
  }, [id]);

  if (alreadySeen) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden,
        visible: { ...visible, transition: { duration, delay, ease: 'easeOut' } },
      }}
      onAnimationComplete={onVisible}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  id?: string;
  className?: string;
  stagger?: number;
  once?: boolean;
  amount?: number;
}

export function StaggerContainer({
  children,
  id,
  className,
  stagger = 0.08,
  once = true,
  amount = 0.1,
}: StaggerContainerProps) {
  const alreadySeen = useHasBeenSeen(id);
  const markedRef = useRef(false);

  const onVisible = useCallback(() => {
    if (id && !markedRef.current) {
      markedRef.current = true;
      markSeen(id);
    }
  }, [id]);

  if (alreadySeen) {
    return (
      <SkipAnimationCtx.Provider value={true}>
        <div className={className}>{children}</div>
      </SkipAnimationCtx.Provider>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      onAnimationComplete={onVisible}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  preset?: AnimationPreset;
  duration?: number;
  className?: string;
}

export function StaggerItem({
  children,
  preset = 'fade-up',
  duration = 0.5,
  className,
}: StaggerItemProps) {
  const skip = useContext(SkipAnimationCtx);

  if (skip) {
    return <div className={className}>{children}</div>;
  }

  const { hidden, visible } = presets[preset];

  return (
    <motion.div
      variants={{
        hidden,
        visible: { ...visible, transition: { duration, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
