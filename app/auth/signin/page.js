"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";

export default function SignIn() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

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

  const handleRegisterRedirect = () => {
    router.push("/auth/register");
  };
  const handleGitHubLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div>
      <h1>Sign In</h1>
      {status === "loading" && <Loading />}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div>
        <button onClick={handleGitHubLogin} disabled={isLoading}>
          Sign In with GitHub
        </button>
      </div>

      <p>
        Don't have an account?{" "}
        <button onClick={handleRegisterRedirect}>Register</button>
      </p>
      <button
        onClick={() => {
          router.push("/");
        }}
      >
        Home
      </button>
    </div>
  );
}
