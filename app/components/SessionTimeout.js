"use client";
import { signOut, useSession, signIn, getSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SessionPopup from "./SessionPopup";

export default function SessionTimeout() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordPromptVisible, setPasswordPromptVisible] = useState(false);
  const [responseTimeout, setResponseTimeout] = useState(45);
  const logoutTimerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const sessionWarningTimerRef = useRef(null);
  const lastActivityTime = useRef(Date.now());
  const INACTIVITY_THRESHOLD = 30 * 60 * 1000; //30*60*1000 = 30 mins

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      setShowPrompt(true);
    }, INACTIVITY_THRESHOLD);
  };

  const handleUserActivity = () => {
    lastActivityTime.current = Date.now();
    if (!isPasswordPromptVisible) {
      resetInactivityTimer();
    }
  };

  useEffect(() => {
    let timer;
    if (showPrompt || isPasswordPromptVisible) {
      timer = setInterval(() => {
        setResponseTimeout((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            signOut({ callbackUrl: "/" });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [showPrompt, isPasswordPromptVisible]);

  useEffect(() => {
    if (isPasswordPromptVisible) {
      clearTimeout(inactivityTimerRef.current);
    } else {
      resetInactivityTimer();
    }
  }, [isPasswordPromptVisible]);

  useEffect(() => {
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);
    document.addEventListener("click", handleUserActivity);
    return () => {
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      document.removeEventListener("click", handleUserActivity);
    };
  }, [isPasswordPromptVisible]);

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
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, remainingTimeInMs);
    }
  };

  const stayLoggedIn = async () => {
    setShowPrompt(false);
    clearTimeout(logoutTimerRef.current);
    clearTimeout(sessionWarningTimerRef.current);
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

  if (showPrompt && !isPasswordPromptVisible) {
    return (
      <SessionPopup
        displayText={`Your session is about to expire in ${responseTimeout} seconds.\nDo you want to stay logged in?`}
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
        remainingTime={responseTimeout}
      />
    );
  }

  return null;
}
