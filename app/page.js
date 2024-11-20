"use client";

import { useRouter } from "next/navigation";

import styles from "./page.module.css"; // Import the CSS module
import Header from "./components/style/Header";
import Footer from "./components/style/Footer";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <Header />
      <div className={styles.landingContainer}>
        {status === "unauthenticated" ? (
          <h1 className={styles.heading}>Welcome to the Dashboard App</h1>
        ) : (
          <h1 className={styles.heading}>Welcome back {session?.user?.name}</h1>
        )}

        <div className={styles.buttonsContainer}>
          <button className={styles.button} onClick={handleDashboardClick}>
            Go to Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
