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
import { Skeleton } from '@/components/skeleton/Skeleton';
import { Title } from '@/components/typography/Typography.tsx';
import { useUser } from '@/hooks/useUser.ts';

export default function Profile() {
  return (
    <MainContainer>
      <Title>Profile</Title>
      <ProfileCard />
    </MainContainer>
  );
}

function ProfileCard() {
  const { user, isLoading, error } = useUser();

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
