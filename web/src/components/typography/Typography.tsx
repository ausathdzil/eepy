import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import styles from './typography.module.css';

export function TypographyH1({ className, ...props }: ComponentProps<'h1'>) {
  return <h1 className={cn(styles.h1, className)} {...props} />;
}

export function TypographyH2({ className, ...props }: ComponentProps<'h2'>) {
  return <h2 className={cn(styles.h2, className)} {...props} />;
}

export function TypographyP({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn(styles.p, className)} {...props} />;
}

export function List({ className, ...props }: ComponentProps<'ul'>) {
  return <ul className={cn(styles.list, className)} {...props} />;
}
