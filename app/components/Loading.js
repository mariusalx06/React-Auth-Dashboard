'use client';

import styles from "@/app/components/Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingMessage}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}