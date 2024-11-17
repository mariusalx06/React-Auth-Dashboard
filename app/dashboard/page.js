'use client';  // Mark as client component because we use useSession and useRouter

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect to sign-in page if not authenticated
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    // You can return a loading spinner or placeholder here while session is loading
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {session?.user?.name}!</h1>
      <p>You are now logged in and viewing your dashboard.</p>

      {/* Display the logout button only if the user is authenticated */}
      {status === 'authenticated' && (
        <button
          onClick={() => {
            signOut({ callbackUrl: '/' }); // Sign out and redirect to home page
          }}
        >
          Log Out
        </button>
      )}
    </div>
  );
}
