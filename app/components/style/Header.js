"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Link from "next/link";
import SubjectIcon from "@mui/icons-material/Subject";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

export default function Header() {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const menuRef = useRef(null);
  const userRef = useRef(null);

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

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
    setIsUserOpen(false);
  };

  const handleUserClick = () => {
    setIsUserOpen((prev) => !prev);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && router.events) {
      const handleRouteChange = () => {
        setIsMenuOpen(false);
        setIsUserOpen(false);
      };

      router.events.on("routeChangeStart", handleRouteChange);

      return () => {
        router.events.off("routeChangeStart", handleRouteChange);
      };
    }
  }, [router]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsUserOpen(false);
  };

  return (
    <header className={`${styles.header}`}>
      <div className={styles.container}>
        <h1 className={styles.logo}>{title}</h1>

        <div className={styles.menuIconWrapper} ref={menuRef}>
          <SubjectIcon className={styles.icon} onClick={handleMenuClick} />
          <ArrowDropDownIcon onClick={handleMenuClick} />
          {isMenuOpen && (
            <div>
              <div className={styles.arrow}></div>
              <div className={styles.dropdown}>
                <Link
                  href="/"
                  className={`${styles.link} ${
                    pathname === "/" ? styles.activeLink : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  <HomeIcon style={{ verticalAlign: "bottom" }} />
                  Home
                </Link>
                <Link
                  href="/dashboard/home"
                  className={`${styles.link} ${
                    pathname.includes("dashboard") ? styles.activeLink : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  <DashboardIcon style={{ verticalAlign: "bottom" }} />
                  Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className={styles.userIconWrapper} ref={userRef}>
          <PersonIcon className={styles.icon} onClick={handleUserClick} />
          <ArrowDropDownIcon onClick={handleUserClick} />
          {isUserOpen && (
            <div>
              <div className={styles.arrow}></div>
              <div className={styles.dropdown}>
                {status === "authenticated" ? (
                  <>
                    <Link
                      href="/profile"
                      className={`${styles.link} ${
                        pathname === "/profile" ? styles.activeLink : ""
                      }`}
                      onClick={handleLinkClick}
                    >
                      <AccountBoxIcon style={{ verticalAlign: "bottom" }} />
                      Profile
                    </Link>
                    <button
                      className={`${styles.buttonBase} ${styles.logoutButton}`}
                      onClick={() => {
                        handleLinkClick();
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      <ExitToAppIcon className={styles.icon} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className={`${styles.buttonBase} ${styles.signinButton}`}
                    onClick={handleLinkClick}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
