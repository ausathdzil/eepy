import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { shortenUrl } from '@/lib/actions/url.ts';
import { API_URL, BASE_URL } from '@/lib/utils.ts';
import { Card, CardContent, CardFooter } from '../card/Card.tsx';
import { Button } from '../ui/button.tsx';
import { Input } from '../ui/input.tsx';
import { Label } from '../ui/label.tsx';

export default function UrlForm() {
  const {
    data: _data,
    error,
    trigger,
    isMutating,
  } = useSWRMutation(`${API_URL}/url`, shortenUrl);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const long_url = formData.get('long_url') as string;
    const short_url = formData.get('short_url') as string;
    await trigger(
      { long_url, short_url },
      {
        onSuccess: () => {
          mutate((key) => Array.isArray(key) && key[0] === `${API_URL}/url`);
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="long_url">Enter your URL</Label>
            <Input
              id="long_url"
              name="long_url"
              placeholder="https://example.com"
              required
              type="url"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_url">Enter custom short URL (optional)</Label>
            <div className="flex rounded-md shadow-xs">
              <span className="inline-flex items-center rounded-s-md border border-input bg-background px-3 text-muted-foreground text-sm">
                {BASE_URL}/u/
              </span>
              <Input
                className="-ms-px rounded-s-none shadow-none"
                id="short_url"
                name="short_url"
                placeholder="blog"
                type="text"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="!items-start flex-col gap-2">
          <Button className="w-full" disabled={isMutating} type="submit">
            Shorten URL
          </Button>
          {error && <p className="text-destructive text-sm">{error.message}</p>}
        </CardFooter>
      </form>
    </Card>
  );
}
