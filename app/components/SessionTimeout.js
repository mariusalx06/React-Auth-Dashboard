'use client';

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionTimeout() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [sessionResolved, setSessionResolved] = useState(false);  // Track session loading state

  useEffect(() => {
    // Only trigger the effect when session status is not 'loading'
    if (status === 'loading') {
      console.log("Session is still loading, skipping redirection.");
      return;
    }

    // When session is resolved (not loading), we can trigger inactivity timer
    setSessionResolved(true);  // Mark session as resolved

    let timer;

    // Set the timer to log out the user after the desired time (e.g., 1 minute)
    const logoutTimer = setTimeout(() => {
      console.log("Session expired, signing out...");
      signOut({
        callbackUrl: '/',  // Redirect to the main page after logout
      });
    }, 60000);  // 60 seconds of fixed timeout

    // Clean up the timer when the component is unmounted or session status changes
    return () => {
      clearTimeout(logoutTimer);
    };
  }, [status]);  // Run this effect when the session status changes

  useEffect(() => {
    // Prevent redirection until session is fully resolved (not loading)
    if (!sessionResolved) {
      console.log("Session is still being resolved, no redirection.");
      return;
    }

    // Redirect to the main page if session is unauthenticated
    if (status === 'unauthenticated' && !session) {
      console.log("Redirecting to '/' due to unauthenticated status...");
      router.push('/');
    }
  }, [status, session, sessionResolved, router]);

  return null;  // This component doesn't render anything
}
