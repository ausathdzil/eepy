import { useId } from 'react';
import { useNavigate } from 'react-router';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/card/Card.tsx';
import { MainContainer } from '@/components/containers/Containers.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useUser } from '@/hooks/useUser.ts';
import { updatePassword, updateProfile } from '@/lib/actions/user';
import { API_URL } from '@/lib/utils';

export default function Settings() {
  const { token, user, isLoading, error } = useUser();

  return (
    <MainContainer>
      <UpdateProfile
        error={error}
        isLoading={isLoading}
        token={token}
        user={user}
      />
      <UpdateSecurity token={token} />
    </MainContainer>
  );
}

type UpdateProfileProps = Pick<
  ReturnType<typeof useUser>,
  'user' | 'isLoading' | 'error'
>;

function UpdateProfile({
  token,
  user,
  isLoading,
  error,
}: UpdateProfileProps & { token: string | null | undefined }) {
  const id = useId();

  const {
    error: updateError,
    trigger,
    isMutating,
  } = useSWRMutation(`${API_URL}/users/me`, updateProfile);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const fullName = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    await trigger(
      { token, fullName, email },
      {
        onSuccess: () => {
          mutate(
            (key) => Array.isArray(key) && key[0] === `${API_URL}/users/me`
          );
        },
      }
    );
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading && !user) {
    return <Skeleton className="h-[272px] w-full" />;
  }

  if (!user) {
    return <div>Data not found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <CardContent className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor={`${id}-full_name`}>Full Name</Label>
            <Input
              defaultValue={user.full_name}
              id={`${id}-full_name`}
              maxLength={255}
              name="full_name"
              required
              type="text"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              defaultValue={user.email}
              id={`${id}-email`}
              maxLength={255}
              name="email"
              required
              type="email"
            />
          </div>
        </CardContent>
        <CardFooter className="!items-start flex flex-col gap-2">
          <Button disabled={isMutating} type="submit">
            Update Profile
          </Button>
          {updateError && (
            <p className="text-destructive text-sm">{updateError.message}</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

function UpdateSecurity({ token }: { token: string | null | undefined }) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const id = useId();

  const {
    error: updateError,
    trigger,
    isMutating,
  } = useSWRMutation(`${API_URL}/users/me/password`, updatePassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const currentPassword = formData.get('current_password') as string;
    const newPassword = formData.get('new_password') as string;
    await trigger(
      { token, currentPassword, newPassword },
      {
        onSuccess: () => {
          setAccessToken(null);
          mutate(() => true, undefined, { revalidate: false });
          navigate('/auth/login', { replace: true });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <CardContent className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor={`${id}-current_password`}>Current Password</Label>
            <Input
              id={`${id}-current_password`}
              maxLength={255}
              minLength={8}
              name="current_password"
              required
              type="password"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${id}-email`}>New Password</Label>
            <Input
              id={`${id}-new_password`}
              maxLength={255}
              minLength={8}
              name="new_password"
              required
              type="password"
            />
          </div>
        </CardContent>
        <CardFooter className="!items-start flex flex-col gap-2">
          <Button disabled={isMutating} type="submit">
            Update Password
          </Button>
          {updateError && (
            <p className="text-destructive text-sm">{updateError.message}</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
