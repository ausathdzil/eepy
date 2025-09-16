import useSWR from 'swr';

import { getActiveUrls } from '@/lib/data.ts';
import { API_URL } from '@/lib/utils.ts';
import { Link } from './link/Link.tsx';
import { List } from './typography/Typography.tsx';

export default function ActiveUrls() {
  const {
    data: urls,
    error,
    isLoading,
  } = useSWR(`${API_URL}/url`, getActiveUrls);

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <List>
      {urls?.data.map((item) => (
        <li key={item.id}>
          <Link
            href={`${API_URL}/url/${item.short_url}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {`${API_URL}/url/${item.short_url}`}
          </Link>
        </li>
      ))}
    </List>
  );
}
