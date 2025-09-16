import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { shortenUrl } from './lib/actions.ts';
import { getActiveUrls } from './lib/data.ts';
import { API_URL } from './lib/utils.ts';

export default function App() {
  return (
    <main className="container flex flex-col gap-8 max-w-3xl mx-auto p-8">
      <UrlForm />
      <ActiveUrls />
    </main>
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
    <section>
      <h1>Shorten URL</h1>
      <form onSubmit={handleSubmit}>
        <input type="url" placeholder="Enter URL" name="url" required />
        <button disabled={isMutating} type="submit">
          {isMutating ? 'Shortening...' : 'Shorten'}
        </button>
      </form>
      {error && <div>{error.message}</div>}
      {data?.short_url && <div>Successfully shortened URL</div>}
    </section>
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
    <section>
      <h1>Active URLs</h1>
      <ul>
        {urls?.data.map((item) => (
          <li key={item.id}>
            <a
              href={`${API_URL}/url/${item.short_url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`${API_URL}/url/${item.short_url}`}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
