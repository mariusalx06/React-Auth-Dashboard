"use client";

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          © 2024 Marius's Dashboard App. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
