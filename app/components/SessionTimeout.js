'use client';
import styles from "@/app/components/SessionTimeout.module.css";

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionTimeout() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [timerActive, setTimerActive] = useState(true); // Track if the timer is active
  let timeoutRef, intervalRef;

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      if (timerActive) {
        intervalRef = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        timeoutRef = setTimeout(() => router.push('/auth/signin'), 5000);
      }
      return () => {
        clearInterval(intervalRef);
        clearTimeout(timeoutRef);
      };
    }
    
    const expirationTime = session?.expires;
    if (expirationTime) {
      const remainingTime = new Date(expirationTime).getTime() - Date.now();
      const logoutTimer = setTimeout(() => signOut({ callbackUrl: '/' }), remainingTime);
      return () => clearTimeout(logoutTimer);
    }
  }, [status, session, router, timerActive]);

  const handleRedirect = () => {
    setTimerActive(false); // Stop the countdown and redirect
    clearInterval(intervalRef);
    clearTimeout(timeoutRef);
    router.push('/auth/signin');
  };

  if (status === 'unauthenticated') {
    return (
      <div className={styles.overlay}>
        <div className={styles.messageContainer}>
          <p>You are not logged in. Redirecting to log-in in {countdown} seconds...</p>
          <button onClick={handleRedirect}>Go to Login</button>
        </div>
      </div>
    );
  }

  return null;
}
