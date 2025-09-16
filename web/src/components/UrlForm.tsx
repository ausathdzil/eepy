import { LoaderIcon } from 'lucide-react';

import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { shortenUrl } from '@/lib/actions.ts';
import { API_URL } from '@/lib/utils.ts';
import { Card, CardContent, CardFooter } from './card/Card.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';

export default function UrlForm() {
  const {
    data: _data,
    error: _error,
    trigger,
    isMutating,
  } = useSWRMutation(`${API_URL}/url/shorten`, shortenUrl);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const url = formData.get('url') as string;
    await trigger({ long_url: url });
    mutate(`${API_URL}/url`);
  };

  return (
    <Card className="w-full max-w-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <CardContent className="space-y-2">
          <Label>Enter your URL</Label>
          <Input
            name="url"
            placeholder="https://example.com"
            required
            type="url"
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isMutating} type="submit">
            {isMutating ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              'Shorten URL'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
