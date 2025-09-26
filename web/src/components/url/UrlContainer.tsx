import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils.ts';
import styles from './url.module.css';

export function UrlContainer({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn(styles.urlContainer, className)} {...props} />;
}
