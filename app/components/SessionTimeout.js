"use client";
import styles from "@/app/components/SessionTimeout.module.css";
import { signOut, useSession, signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SessionPopup from "./SessionPopup";

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
    if (status === "loading" || status === "unauthenticated") return;
    const expirationTime = session?.expires;
    if (expirationTime) {
      const expirationTimeInMs = new Date(expirationTime).getTime();
      const currentTimeInMs = Date.now();
      const remainingTimeInMs = expirationTimeInMs - currentTimeInMs;
      const remainingTimeInSeconds = Math.floor(remainingTimeInMs / 1000);
      setRemainingTime(remainingTimeInSeconds);

      clearTimeout(logoutTimerRef);
      logoutTimerRef = setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, remainingTimeInMs);

      const showWarningTimeInMs = remainingTimeInMs - 45000;
      if (showWarningTimeInMs > 0) {
        sessionWarningTimerRef = setTimeout(() => {
          setShowPrompt(true);
        }, showWarningTimeInMs);
      }

      countdownIntervalRef = setInterval(() => {
        const updatedRemainingTimeInMs = expirationTimeInMs - Date.now();
        const updatedRemainingTimeInSeconds = Math.floor(
          updatedRemainingTimeInMs / 1000
        );
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
    if (status === "loading" || status === "authenticated") return;
    if (status === "unauthenticated") {
      const redirectIntervalRef = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
      const redirectTimeoutRef = setTimeout(() => {
        router.push("/auth/signin");
      }, 5000);
      return () => {
        clearInterval(redirectIntervalRef);
        clearTimeout(redirectTimeoutRef);
      };
    }
  }, [status, router]);

  const refreshSessionExpiration = async () => {
    const updatedSession = await getSession();
    const expirationTime = updatedSession?.expires;
    if (expirationTime) {
      const expirationTimeInMs = new Date(expirationTime).getTime();
      const remainingTimeInMs = expirationTimeInMs - Date.now();
      setRemainingTime(Math.floor(remainingTimeInMs / 1000));

      clearTimeout(logoutTimerRef);
      logoutTimerRef = setTimeout(() => {
        signOut({ callbackUrl: "/" });
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

    if (session?.user?.email && session?.provider === "credentials") {
      setPasswordPromptVisible(true);
      return;
    } else if (session?.provider === "github") {
      const resultGithub = await signIn("github", { redirect: false });
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

    const result = await signIn("credentials", {
      redirect: false,
      email: session?.user?.email,
      password: password,
    });

    if (result?.error) {
      setErrorMessage("Incorrect password. Please try again.");
    } else {
      setPasswordPromptVisible(false);
      setErrorMessage("");
      await refreshSessionExpiration();
      window.location.reload();
    }
  };

  if (status === "unauthenticated") {
    return (
      <SessionPopup
        displayText={`You are not logged in. Redirecting to log-in in ${countdown} seconds...`}
        buttonText="Go to Login"
        buttonAction={() => {
          router.push("/auth/signin");
        }}
      />
    );
  }

  if (showPrompt) {
    return (
      <SessionPopup
        displayText={`Your session is about to expire in ${remainingTime} seconds.\nDo you want to stay logged in?`}
        buttonText="Stay Logged In"
        buttonAction={stayLoggedIn}
        buttonText2="Log Out"
        buttonAction2={() => signOut({ callbackUrl: "/" })}
      />
    );
  }

  if (isPasswordPromptVisible) {
    return (
      <SessionPopup
        displayText="Please re-enter your password to stay logged in:"
        displayText2={`${session?.user?.email}`}
        showPasswordInput={true}
        password={password}
        onPasswordChange={(e) => setPassword(e.target.value)}
        errorMessage={errorMessage}
        buttonText="Submit"
        buttonAction={handlePasswordSubmit}
        buttonText2="Log Out"
        buttonAction2={() => signOut({ callbackUrl: "/" })}
        remainingTime={remainingTime}
      />
    );
  }

  return null;
}
