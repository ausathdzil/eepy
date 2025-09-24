import { SearchIcon } from 'lucide-react';
import { useId } from 'react';
import { useSearchParams } from 'react-router';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from './ui/input.tsx';

const DEBOUNCE_DELAY = 500;

export function SearchInput({ placeholder }: { placeholder: string }) {
  const id = useId();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
      params.delete('page');
    }
    setSearchParams(params);
  }, DEBOUNCE_DELAY);

  return (
    <div className="relative">
      <label className="sr-only" htmlFor={`${id}-search`}>
        Search
      </label>
      <Input
        className="peer ps-9 pe-9"
        defaultValue={searchParams.get('q') || ''}
        id={`${id}-search`}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        type="search"
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
    </div>
  );
}
