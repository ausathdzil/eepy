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
import { register } from '@/lib/actions/auth.ts';
import { API_URL } from '@/lib/utils.ts';

export default function Register() {
  const navigate = useNavigate();
  const id = useId();

  const { error, trigger, isMutating } = useSWRMutation(
    `${API_URL}/auth/register`,
    register
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await trigger(formData, {
      onSuccess: () => {
        mutate(() => true);
        navigate('/');
      },
    });
  };

  return (
    <MainContainer className="items-center justify-center">
      <Title>Register</Title>
      <form
        className="mx-auto w-full max-w-sm space-y-4"
        onSubmit={handleSubmit}
      >
        <Label htmlFor={`${id}-full_name`}>Full Name</Label>
        <Input
          id={`${id}-full_name`}
          name="full_name"
          placeholder="John Doe"
          required
          type="text"
        />
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
          Register
        </Button>
        {error && <p className="text-destructive text-sm">{error.message}</p>}
      </form>
      <Link href="/auth/login">
        Already have an account? <span className="text-primary">Login</span>
      </Link>
    </MainContainer>
  );
}
