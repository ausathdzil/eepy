import { ArrowRightIcon } from 'lucide-react';

import useSWR from 'swr';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/card/Card.tsx';
import { MainContainer } from '@/components/containers/Containers.tsx';
import { LogoutButton } from '@/components/LogoutButton.tsx';
import { Link } from '@/components/link/Link.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import { Title } from '@/components/typography/Typography.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { getTotalUrl } from '@/lib/data/url.ts';
import { API_URL, formatDate } from '@/lib/utils.ts';
import type { User } from '@/types/user.ts';

export default function Profile() {
  const { token, user, isLoading: isUserLoading, error: userError } = useUser();
  const {
    data,
    error: dataError,
    isLoading: isDataLoading,
  } = useSWR(
    user ? [`${API_URL}/url/total`, token] : null,
    ([url, arg]) => getTotalUrl(url, arg),
    { keepPreviousData: true }
  );

  return (
    <MainContainer>
      <Title>Profile</Title>
      <ProfileCard
        data={data}
        dataError={dataError}
        isDataLoading={isDataLoading}
        isUserLoading={isUserLoading}
        user={user}
        userError={userError}
      />
    </MainContainer>
  );
}

type ProfileCardProps = {
  user: User | null | undefined;
  isUserLoading: boolean;
  userError: Error | null;
  data: { count: number } | undefined;
  isDataLoading: boolean;
  dataError: Error | null;
};

function ProfileCard({
  user,
  isUserLoading,
  userError,
  data,
  isDataLoading,
  dataError,
}: ProfileCardProps) {
  if (userError) {
    return <div>{userError.message}</div>;
  }

  if (dataError) {
    return <div>{dataError.message}</div>;
  }

  if ((isUserLoading || isDataLoading) && !user && !data) {
    return <Skeleton className="h-[232px] w-full" />;
  }

  if (!user) {
    return <div>User not found.</div>;
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
      <CardContent className="space-y-2">
        <p>
          Joined at:{' '}
          <span className="font-medium text-primary">
            {formatDate(user.created_at)}
          </span>
        </p>
        <p>
          Last updated:{' '}
          <span className="font-medium text-primary">
            {formatDate(user.updated_at)}
          </span>
        </p>
        <p>
          Total URLs:{' '}
          <span className="font-medium text-primary">{data?.count}</span>
        </p>
      </CardContent>
      <CardFooter>
        <Link href="/profile/urls" variant="secondary">
          View All URLs
          <ArrowRightIcon />
        </Link>
      </CardFooter>
    </Card>
  );
}
