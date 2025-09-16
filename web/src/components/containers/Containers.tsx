import type { ComponentProps, CSSProperties } from 'react';

import styles from './containers.module.css';
import { cn } from '../../lib/utils.ts';

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
      style={{
        alignContent: align,
        flexDirection: direction,
        gap: gap,
      }}
      className={cn(styles.stack, className)}
      {...props}
    />
  );
}
