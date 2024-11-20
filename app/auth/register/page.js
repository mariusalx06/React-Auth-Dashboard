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
    agentid: "",
  });
  const [role, setRole] = useState("agent");
  const [error, setError] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const [showRedirect, setShowRedirect] = useState(false);
  const [countRedirect, setCountRedirect] = useState(5);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.agentid != "M001") {
      setShowAlert(true);
    }
    if (status === "authenticated" && session?.user?.agentid === "M001") {
      return;
    }
    if (status === "unauthenticated") {
      setShowRedirect(true);
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

  useEffect(() => {
    if (showRedirect && countRedirect > 0) {
      const intervalRedirect = setInterval(() => {
        setCountRedirect((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(intervalRedirect);
            setTimeout(() => {
              router.push("/auth/signin");
            }, 300);
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(intervalRedirect);
    }
  }, [showRedirect, countRedirect, router]);

  async function handleSubmit(e) {
    e.preventDefault();

    const { email, password, name, agentid } = user;
    const roleToSend = role || "agent";

    if (!email || !password || !name || !agentid || !roleToSend) {
      setError("All fields are required, including AgentID and Role");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        email,
        password,
        name,
        agentid,
        role: roleToSend,
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
  }

  async function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevUserDetails) => {
      return {
        ...prevUserDetails,
        [name]: value,
      };
    });
  }

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

          <div>
            <label className={styles.label}>Select Role</label>
            <select
              className={styles.input}
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
              required
            >
              <option className={styles.option} value="manager">
                Manager
              </option>
              <option className={styles.option} value="agent">
                Agent
              </option>
            </select>
          </div>
          <div>
            <label className={styles.label}>AgentID</label>
            <input
              className={styles.input}
              name="agentid"
              type="text"
              placeholder="AgentID"
              value={user.agentid}
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
      {showRedirect && (
        <Alert
          displayText={`Please contact the ADMIN to get registered. Redirecting to LogIn in ${countRedirect} seconds...`}
          buttonText="Proceed"
          buttonAction={() => router.push("/auth/signin")}
        />
      )}
    </div>
  );
}
