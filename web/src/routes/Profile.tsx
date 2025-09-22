import { useNavigate } from 'react-router';
import useSWR from 'swr';

import { MainContainer } from '@/components/containers/Containers.tsx';
import { TypographyH1 } from '@/components/typography/Typography.tsx';
import { UrlCard } from '@/components/url/UrlCard.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { getUrls } from '@/lib/data/url.ts';
import { API_URL } from '@/lib/utils.ts';

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth/login');
  }

  const params = { limit: 9, order: 'desc' };

  const {
    data: urls,
    error: _error,
    isLoading: _isLoading,
  } = useSWR([`${API_URL}/url`, params], ([url, arg]) => getUrls(url, arg));

  return (
    <MainContainer>
      <TypographyH1>My URLs</TypographyH1>
      <div className="grid grid-cols-3 gap-4">
        {urls?.data.map((url) => (
          <UrlCard className="basis-1/3" key={url.id} url={url} />
        ))}
      </div>
    </MainContainer>
  );
}
