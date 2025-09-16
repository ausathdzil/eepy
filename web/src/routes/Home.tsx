import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { MainContainer, Stack } from '@/components/containers/Containers.tsx';
import {
  List,
  TypographyH1,
  TypographyH2,
} from '@/components/typography/Typography.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { shortenUrl } from '@/lib/actions.ts';
import { getActiveUrls } from '@/lib/data.ts';
import { API_URL } from '@/lib/utils.ts';

export default function Home() {
  return (
    <MainContainer>
      <TypographyH1>EEPY</TypographyH1>
      <UrlForm />
      <ActiveUrls />
    </MainContainer>
  );
}

function UrlForm() {
  const { data, error, trigger, isMutating } = useSWRMutation(
    `${API_URL}/url/shorten`,
    shortenUrl
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const url = formData.get('url') as string;
    await trigger({ long_url: url });
    mutate(`${API_URL}/url`);
  };

  return (
    <Stack align="start" direction="column" gap="calc(var(--spacing) * 4)">
      <TypographyH2>Shorten URL</TypographyH2>
      <form onSubmit={handleSubmit}>
        <Input name="url" placeholder="Enter URL" required type="url" />
        <Button disabled={isMutating} type="submit">
          {isMutating ? 'Shortening...' : 'Shorten'}
        </Button>
      </form>
      {error && <div>{error.message}</div>}
      {data?.short_url && <div>Successfully shortened URL</div>}
    </Stack>
  );
}

function ActiveUrls() {
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
    <Stack align="start" direction="column" gap="calc(var(--spacing) * 4)">
      <TypographyH2>Active URLs</TypographyH2>
      <List>
        {urls?.data.map((item) => (
          <li key={item.id}>
            <a
              href={`${API_URL}/url/${item.short_url}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {`${API_URL}/url/${item.short_url}`}
            </a>
          </li>
        ))}
      </List>
    </Stack>
  );
}
