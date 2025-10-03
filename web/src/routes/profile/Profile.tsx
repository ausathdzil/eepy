import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card/Card.tsx';
import { MainContainer } from '@/components/containers/Containers.tsx';
import { LogoutButton } from '@/components/LogoutButton.tsx';
import { Link } from '@/components/link/Link.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import { Title } from '@/components/typography/Typography.tsx';
import { useUser } from '@/hooks/useUser.ts';

export default function Profile() {
  const { user, isLoading, error } = useUser();

  return (
    <MainContainer>
      <Title>Profile</Title>
      <ProfileCard error={error} isLoading={isLoading} user={user} />
    </MainContainer>
  );
}

type ProfileCardProps = Pick<
  ReturnType<typeof useUser>,
  'user' | 'isLoading' | 'error'
>;

function ProfileCard({ user, isLoading, error }: ProfileCardProps) {
  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading && !user) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!user) {
    return <div>Data not found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.full_name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
        <CardAction className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Link href="/profile/settings" variant="secondary">
            Edit Profile
          </Link>
          <LogoutButton />
        </CardAction>
      </CardHeader>
    </Card>
  );
}
