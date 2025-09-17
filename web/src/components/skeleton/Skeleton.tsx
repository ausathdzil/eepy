import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils.ts';
import styles from './skeleton.module.css';

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(styles.skeleton, className)}
      data-slot="skeleton"
      {...props}
    />
  );
}
