import { LoaderIcon } from 'lucide-react';

import { useParams } from 'react-router';

import { Stack } from '@/components/containers/Containers.tsx';
import { API_URL } from '@/lib/utils.ts';

export default function RedirectUrl() {
  const { short_url } = useParams();

  window.location.href = `${API_URL}/url/${short_url}`;

  return (
    <Stack
      align="center"
      className="min-h-screen"
      direction="column"
      gap="2"
      justify="center"
    >
      <LoaderIcon className="animate-spin" />
      <p>Redirecting</p>
    </Stack>
  );
}
