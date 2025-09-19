import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils.ts';
import styles from './header.module.css';

export function Header({ className, ...props }: ComponentProps<'header'>) {
  return <header className={cn(styles.header, className)} {...props} />;
}
