import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useUser } from '@/hooks/useUser.ts';

export function ProtectedLayout() {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!(isLoading || user)) {
      navigate('/auth/login');
    }
  }, [user, isLoading, navigate]);

  return <Outlet />;
}
