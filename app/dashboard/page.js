"use client";
import { useSession, signOut } from "next-auth/react";
import SessionTimeout from "@/app/components/SessionTimeout";
import { useRouter } from "next/navigation";
import styles from "./page.module.css"; // Import the CSS module

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className={styles.container}>
      <SessionTimeout />
      <div className={styles.content}>
        <h1 className={styles.welcome}>Welcome, {session?.user?.name}!</h1>
        <p className={styles.message}>
          You are now logged in and viewing your dashboard.
        </p>
        {status === "authenticated" && (
          <div className={styles.buttons}>
            <button
              className={styles.logoutButton}
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
            >
              Log Out
            </button>
            <button
              className={styles.homeButton}
              onClick={() => {
                router.push("/");
              }}
            >
              Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
