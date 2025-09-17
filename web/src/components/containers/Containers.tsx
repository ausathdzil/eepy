import type { ComponentProps, CSSProperties } from 'react';

import { cn } from '@/lib/utils.ts';
import styles from './containers.module.css';

export function MainContainer({ className, ...props }: ComponentProps<'main'>) {
  return <main className={cn(styles.main, className)} {...props} />;
}

type StackProps = ComponentProps<'div'> & {
  align?: CSSProperties['alignItems'];
  direction?: CSSProperties['flexDirection'];
  gap?: CSSProperties['gap'];
  justify?: CSSProperties['justifyContent'];
};

export function Stack({
  align = 'start',
  direction = 'column',
  gap,
  justify = 'start',
  className,
  style,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(styles.stack, className)}
      style={{
        alignItems: align,
        flexDirection: direction,
        gap,
        justifyContent: justify,
        ...style,
      }}
      {...props}
    />
  );
}
