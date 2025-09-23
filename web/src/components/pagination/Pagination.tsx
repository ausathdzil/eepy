import type { ComponentProps } from 'react';
import { useSearchParams } from 'react-router';

import { cn } from '@/lib/utils.ts';
import { Button } from '../ui/button.tsx';
import styles from './pagination.module.css';

export function Pagination({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(styles.paginationContainer, className)} {...props} />
  );
}

type PaginationDataProps = {
  count: number;
};

export function PaginationData({ count }: PaginationDataProps) {
  return <p className="text-sm">Total URLs: {count}</p>;
}

type PaginationButtonsProps = {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export function PaginationButtons({
  page,
  totalPages,
  hasNext,
  hasPrevious,
}: PaginationButtonsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p.toString());
    setSearchParams(params);
  };

  return (
    <div className={styles.paginationButtons}>
      <p className="mr-2 text-sm">
        Page {page} of {totalPages}
      </p>
      <Button
        disabled={!hasPrevious}
        onClick={() => handlePageChange(page - 1)}
        variant="outline"
      >
        Previous
      </Button>
      <Button
        disabled={!hasNext}
        onClick={() => handlePageChange(page + 1)}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
}
