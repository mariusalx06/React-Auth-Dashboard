"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import styles from "@/app/auth/register/page.module.css";
import axios from "axios";
import Alert from "@/app/components/Alert";

export default function Register() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

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

    const { email, password, name } = user;

    if (!email || !password || !name) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        email,
        password,
        name,
      });
      if (response.data.success) {
        router.push("/auth/signin");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    }
  };

  async function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevUserDetails) => {
      return {
        ...prevUserDetails,
        [name]: value,
      };
    });
  }

  const handleGitHubLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Register</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              name="name"
              type="text"
              placeholder="Name"
              value={user.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              name="email"
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              name="password"
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            type="submit"
          >
            Register
          </button>
        </form>

        <button
          className={`${styles.button} ${styles.secondaryButton}`}
          onClick={handleGitHubLogin}
        >
          Register/LogIn with GitHub
        </button>

        <button
          onClick={() => {
            router.push("/auth/signin");
          }}
          className={`${styles.button} ${styles.loginButton}`}
        >
          Already have an account? LogIn
        </button>
      </div>
      {showAlert && (
        <Alert
          displayText={`You are already Logged In. Redirecting to Dashboard in ${countdown} seconds...`}
          buttonText="Proceed"
          buttonAction={() => router.push("/dashboard")}
        />
      )}
    </div>
  );
}
