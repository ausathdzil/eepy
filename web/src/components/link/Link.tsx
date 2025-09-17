import type { ComponentProps } from 'react';
import { NavLink } from 'react-router';

import { cn } from '@/lib/utils.ts';
import styles from './link.module.css';

export function Link({
  children,
  className,
  href,
  ...props
}: ComponentProps<'a'>) {
  if (!href || href?.startsWith('#')) {
    return (
      <a className={cn(styles.link, className)} href={href} {...props}>
        {children}
      </a>
    );
  }

  if (href.startsWith('/')) {
    return (
      <NavLink className={cn(styles.link, className)} to={href} {...props}>
        {children}
      </NavLink>
    );
  }

  return (
    <a className={cn(styles.link, className)} href={href} {...props}>
      {children}
    </a>
  );
}
