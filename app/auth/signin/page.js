"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";
import styles from "@/app/auth/signin/page.module.css";
import Alert from "@/app/components/Alert";

export default function SignIn() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === "authenticated") {
      setShowAlert(true);
    }
  }, [status]);

  useEffect(() => {
    if (showAlert && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(interval);
            setTimeout(() => {
              router.push("/dashboard");
            }, 300);
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showAlert, countdown, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: user.email,
      password: user.password,
    });

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;

    setUser((prevUserDetails) => {
      return {
        ...prevUserDetails,
        [name]: value,
      };
    });
  };

  const handleGitHubLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Sign In</h1>
        {status === "loading" && <Loading />}

        <form onSubmit={handleSubmit}>
          <div>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div>
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={handleGitHubLogin}
            disabled={isLoading}
          >
            Sign In with GitHub
          </button>
        </div>

        <button
          onClick={() => {
            router.push("/auth/register");
          }}
          className={styles.button}
        >
          Don't have an account? Register
        </button>
      </div>
      {showAlert && (
        <Alert
          displayText={`You are logged in. Redirecting to Dashboard in ${countdown} seconds...`}
          buttonText="Proceed"
          buttonAction={() => router.push("/dashboard")}
        />
      )}
    </div>
  );
}
