import { MainContainer } from '@/components/containers/Containers.tsx';
import { Title } from '@/components/typography/Typography.tsx';
import { useUser } from '@/hooks/useUser.ts';

export default function Profile() {
  const { user } = useUser();

  return (
    <MainContainer>
      <Title>Profile</Title>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </MainContainer>
  );
}
