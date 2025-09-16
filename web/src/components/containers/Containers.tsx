import type { ComponentProps, CSSProperties } from 'react';

import { cn } from '@/lib/utils.ts';
import styles from './containers.module.css';

export function MainContainer({ className, ...props }: ComponentProps<'main'>) {
  return <main className={cn(styles.main, className)} {...props} />;
}

type StackProps = ComponentProps<'div'> & {
  align: CSSProperties['alignContent'];
  direction: CSSProperties['flexDirection'];
  gap: CSSProperties['gap'];
};

export function Stack({
  align = 'start',
  direction = 'column',
  gap,
  className,
  ...props
}: Partial<StackProps>) {
  return (
    <div
      className={cn(styles.stack, className)}
      style={{
        alignContent: align,
        flexDirection: direction,
        gap,
      }}
      {...props}
    />
  );
}
