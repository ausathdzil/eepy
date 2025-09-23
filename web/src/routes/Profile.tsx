import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import useSWR from 'swr';

import { MainContainer } from '@/components/containers/Containers.tsx';
import { Search } from '@/components/Search.tsx';
import { Title } from '@/components/typography/Typography.tsx';
import { UserUrls } from '@/components/url/UserUrls.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { getUrls } from '@/lib/data/url.ts';
import { API_URL } from '@/lib/utils.ts';

export default function Profile() {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!(isLoading || user)) {
      navigate('/auth/login');
    }
  }, [user, isLoading, navigate]);

  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '6';

  const params = { q: query, page, limit };

  const {
    data: urls,
    error,
    isLoading: isUrlsLoading,
  } = useSWR(user ? [`${API_URL}/url`, params] : null, ([url, arg]) =>
    getUrls(url, arg)
  );

  return (
    <MainContainer>
      <Title>My URLs</Title>
      {urls && urls.data.length > 0 && <Search placeholder="Search URLs..." />}
      <UserUrls error={error} isLoading={isUrlsLoading} urls={urls} />
    </MainContainer>
  );
}
