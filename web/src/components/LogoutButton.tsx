import { useNavigate } from 'react-router';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { useAuthStore } from '@/hooks/useAuthStore.ts';
import { logout } from '@/lib/actions/auth.ts';
import { API_URL } from '@/lib/utils.ts';
import { Button } from './ui/button.tsx';

export function LogoutButton() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/auth/logout`,
    logout
  );

  const handleLogout = async () => {
    await trigger(null, {
      onSuccess: () => {
        setAccessToken(null);
        mutate(() => true, undefined, { revalidate: false });
        navigate('/auth/login', { replace: true });
      },
    });
  };

  return (
    <Button
      disabled={isMutating}
      onClick={handleLogout}
      size="sm"
      variant="destructive"
    >
      Logout
    </Button>
  );
}
