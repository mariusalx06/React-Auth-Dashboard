"use client";

import { useRouter } from "next/navigation";

import styles from "./page.module.css"; // Import the CSS module

export default function Home() {
  const router = useRouter();

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.landingContainer}>
      <h1 className={styles.heading}>Welcome to Marius's Dashboard App</h1>
      <div className={styles.buttonsContainer}>
        <button className={styles.button} onClick={handleDashboardClick}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
