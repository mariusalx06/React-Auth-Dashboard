"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  let title;

  if (pathname === "/") {
    title = "Dashboard App";
  } else if (pathname.includes("/dashboard")) {
    title = `${session?.user?.name}`;
  } else if (pathname === "/profile") {
    title = "Profile Page";
  } else {
    title = "Dashboard App";
  }

  return (
    <header className={`${styles.header}`}>
      <div className={styles.container}>
        <h1 className={styles.logo}>{title}</h1>
        <nav className={styles.nav}>
          {status === "authenticated" ? (
            <Link
              href="/dashboard/home"
              className={`${styles.link} ${
                pathname.includes("/dashboard") ? styles.active : ""
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
