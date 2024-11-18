"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const { status, data: session } = useSession();
  const pathname = usePathname();

  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`${styles.header} ${!showHeader ? styles.hidden : ""}`}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Marius's Dashboard App</h1>
        <nav className={styles.nav}>
          {status === "authenticated" ? (
            <Link
              href="/dashboard"
              className={`${styles.link} ${
                pathname === "/dashboard" ? styles.active : ""
              }`}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className={`${styles.link} ${
                pathname === "/auth/signin" ? styles.active : ""
              }`}
            >
              Sign In
            </Link>
          )}
          <Link
            href="/"
            className={`${styles.link} ${
              pathname === "/" ? styles.active : ""
            }`}
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
