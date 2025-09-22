import { useNavigate } from 'react-router';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

import { MainContainer } from '@/components/containers/Containers.tsx';
import { Link } from '@/components/link/Link.tsx';
import { TypographyH1 } from '@/components/typography/Typography.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { login } from '@/lib/actions/auth.ts';
import { API_URL } from '@/lib/utils.ts';

export default function Login() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (user) {
    navigate('/');
  }

  const { error, trigger, isMutating } = useSWRMutation(
    `${API_URL}/auth/login`,
    login
  );

  const { mutate } = useSWRConfig();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await trigger(formData, {
      onSuccess: () => {
        mutate(`${API_URL}/users/me`);
        navigate('/');
      },
    });
  };

  return (
    <MainContainer className="items-center justify-center">
      <TypographyH1>Login</TypographyH1>
      <form
        className="mx-auto w-full max-w-sm space-y-4"
        onSubmit={handleSubmit}
      >
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="m@example.com"
          required
          type="email"
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          minLength={8}
          name="password"
          required
          type="password"
        />
        <Button className="w-full" disabled={isMutating} type="submit">
          Login
        </Button>
        {error && <p className="text-destructive text-sm">{error.message}</p>}
      </form>
      <Link href="/auth/register">
        Don&apos;t have an account?{' '}
        <span className="text-primary">Register</span>
      </Link>
    </MainContainer>
  );
}
