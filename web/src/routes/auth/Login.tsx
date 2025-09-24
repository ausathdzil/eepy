import { useId } from 'react';
import { useNavigate } from 'react-router';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { MainContainer } from '@/components/containers/Containers.tsx';
import { Link } from '@/components/link/Link.tsx';
import { Title } from '@/components/typography/Typography.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { useAuthStore } from '@/hooks/useAuthStore.ts';
import { login } from '@/lib/actions/auth.ts';
import { API_URL } from '@/lib/utils.ts';

export default function Login() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const id = useId();

  const { error, trigger, isMutating } = useSWRMutation(
    `${API_URL}/auth/login`,
    login
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await trigger(formData, {
      onSuccess: (data) => {
        setAccessToken(data.access_token);
        mutate(() => true);
        navigate('/');
      },
    });
  };

  return (
    <MainContainer className="items-center justify-center">
      <Title>Login</Title>
      <form
        className="mx-auto w-full max-w-sm space-y-4"
        onSubmit={handleSubmit}
      >
        <Label htmlFor={`${id}-email`}>Email</Label>
        <Input
          id={`${id}-email`}
          name="email"
          placeholder="m@example.com"
          required
          type="email"
        />
        <Label htmlFor={`${id}-password`}>Password</Label>
        <Input
          id={`${id}-password`}
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
