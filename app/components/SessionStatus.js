'use client';

import { useSession } from 'next-auth/react';
import Loading from '@/app/components/Loading';

export default function SessionStatus({ children }) {
  const { status } = useSession();
  if (status === 'loading') {
    return <Loading />;
  }

  return <>{children}</>;
}
