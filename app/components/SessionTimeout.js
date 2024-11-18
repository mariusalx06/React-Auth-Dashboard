'use client'
import styles from "@/app/components/SessionTimeout.module.css";
import { signOut, useSession, signIn, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionTimeout() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordPromptVisible, setPasswordPromptVisible] = useState(false);

  let logoutTimerRef, sessionWarningTimerRef, countdownIntervalRef;

  useEffect(() => {
    if (status === 'loading' || status === 'unauthenticated') return;
    const expirationTime = session?.expires;
    if (expirationTime) {
      const expirationTimeInMs = new Date(expirationTime).getTime();
      const currentTimeInMs = Date.now();
      const remainingTimeInMs = expirationTimeInMs - currentTimeInMs;
      const remainingTimeInSeconds = Math.floor(remainingTimeInMs / 1000);
      setRemainingTime(remainingTimeInSeconds);

      clearTimeout(logoutTimerRef);
      logoutTimerRef = setTimeout(() => {
        signOut({ callbackUrl: '/' });
      }, remainingTimeInMs);

      const showWarningTimeInMs = remainingTimeInMs - 45000;
      if (showWarningTimeInMs > 0) {
        sessionWarningTimerRef = setTimeout(() => {
          setShowPrompt(true);
        }, showWarningTimeInMs);
      }

      countdownIntervalRef = setInterval(() => {
        const updatedRemainingTimeInMs = expirationTimeInMs - Date.now();
        const updatedRemainingTimeInSeconds = Math.floor(updatedRemainingTimeInMs / 1000);
        setRemainingTime(updatedRemainingTimeInSeconds);
        if (updatedRemainingTimeInSeconds <= 0) {
          clearInterval(countdownIntervalRef);
        }
      }, 1000);

      return () => {
        clearTimeout(logoutTimerRef);
        clearTimeout(sessionWarningTimerRef);
        clearInterval(countdownIntervalRef);
      };
    }
  }, [status, session]);

  useEffect(() => {
    if (status === 'loading' || status === 'authenticated') return;
    if (status === 'unauthenticated') {
      const redirectIntervalRef = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
      const redirectTimeoutRef = setTimeout(() => {
        router.push('/auth/signin');
      }, 5000);
      return () => {
        clearInterval(redirectIntervalRef);
        clearTimeout(redirectTimeoutRef);
      };
    }
  }, [status, router]);

  const handleRedirect = () => {
    router.push('/auth/signin');
  };

  const refreshSessionExpiration = async () => {
    const updatedSession = await getSession();
    const expirationTime = updatedSession?.expires;
    if (expirationTime) {
      const expirationTimeInMs = new Date(expirationTime).getTime();
      const remainingTimeInMs = expirationTimeInMs - Date.now();
      setRemainingTime(Math.floor(remainingTimeInMs / 1000));

      clearTimeout(logoutTimerRef);
      logoutTimerRef = setTimeout(() => {
        signOut({ callbackUrl: '/' });
      }, remainingTimeInMs);

      const showWarningTimeInMs = remainingTimeInMs - 45000;
      if (showWarningTimeInMs > 0) {
        sessionWarningTimerRef = setTimeout(() => {
          setShowPrompt(true);
        }, showWarningTimeInMs);
      }
    }
  };

  const stayLoggedIn = async () => {
    setShowPrompt(false);
    clearTimeout(logoutTimerRef);
    clearTimeout(sessionWarningTimerRef);

    if (session?.user?.email && session?.provider === 'credentials') {
      setPasswordPromptVisible(true);
      return;
    }


    else if (session?.provider === 'github') {
      const resultGithub = await signIn('github', { redirect: false });
      if (resultGithub?.error) {
        console.error("GitHub sign-in error:", resultGithub.error);
      } else {
        refreshSessionExpiration();
      }
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    const result = await signIn('credentials', {
      redirect: true,
      email: session?.user?.email,
      password: password,
    });

    if (result?.error) {
      setErrorMessage("Incorrect password. Please try again.");
    } else {
      setPasswordPromptVisible(false);
      setErrorMessage("");
      await refreshSessionExpiration();
    }
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

  if (showPrompt) {
    return (
      <div className={styles.overlay}>
        <div className={styles.messageContainer}>
          <p>Your session is about to expire in {remainingTime} seconds. Do you want to stay logged in?</p>
          <button onClick={stayLoggedIn}>Stay Logged In</button>
          <button onClick={() => signOut({ callbackUrl: '/' })}>Log Out</button>
        </div>
      </div>
    );
  }

  if (isPasswordPromptVisible) {
    return (
      <div className={styles.overlay}>
        <div className={styles.messageContainer}>
          <p>Please re-enter your password to stay logged in:</p>
          <p>Email: {session?.user?.email}</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <button onClick={handlePasswordSubmit}>Submit</button>
          <button onClick={() => signOut({ callbackUrl: '/' })}>Log Out</button>
          <p>{remainingTime} seconds</p>
        </div>
      </div>
    );
  }

  return null;
}
