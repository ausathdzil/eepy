import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { NavLink } from 'react-router';

import { cn } from '@/lib/utils.ts';
import { buttonVariants } from '../ui/button.tsx';
import styles from './link.module.css';

export function Link({
  children,
  className,
  href,
  variant = 'ghost',
  size = 'sm',
  ...props
}: ComponentProps<'a'> & VariantProps<typeof buttonVariants>) {
  if (!href || href?.startsWith('#')) {
    return (
      <a className={cn(styles.link, className)} href={href} {...props}>
        {children}
      </a>
    );
  }

  if (href.startsWith('/')) {
    return (
      <NavLink
        className={cn(buttonVariants({ variant, size }), className)}
        to={href}
        {...props}
      >
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
