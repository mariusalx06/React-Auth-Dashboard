'use client'; // Ensure this component runs on the client side

import { useSession } from 'next-auth/react';
import Loading from '@/app/components/Loading';  // Import the loading spinner component

export default function SessionStatus({ children }) {
  const { status } = useSession();  // Get the current session status

  if (status === 'loading') {
    return <Loading />;  // Show the loading spinner while the session is loading
  }

  return <>{children}</>;  // Render the children when the session is loaded
}
