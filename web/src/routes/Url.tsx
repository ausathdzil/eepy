import { useParams } from 'react-router';

import { Stack } from '@/components/containers/Containers';
import { API_URL } from '@/lib/utils.ts';

export default function Url() {
  const { short_url } = useParams();

  window.location.href = `${API_URL}/url/${short_url}`;

  return (
    <Stack align="center" className="min-h-screen" justify="center">
      Redirecting...
    </Stack>
  );
}
