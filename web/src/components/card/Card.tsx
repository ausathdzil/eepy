import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils.ts';
import styles from './card.module.css';

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(styles.card, className)} data-slot="card" {...props} />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(styles.cardHeader, className)}
      data-slot="card-header"
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(styles.cardTitle, className)}
      data-slot="card-title"
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(styles.cardDescription, className)}
      data-slot="card-description"
      {...props}
    />
  );
}

export function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(styles.cardAction, className)}
      data-slot="card-action"
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(styles.cardContent, className)}
      data-slot="card-content"
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(styles.cardFooter, className)}
      data-slot="card-footer"
      {...props}
    />
  );
}
