"use client";

import { useState, useEffect } from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          © {currentYear} Marius's Dashboard App. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
