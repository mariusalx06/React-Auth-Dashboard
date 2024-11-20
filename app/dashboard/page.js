"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import SessionTimeout from "@/app/components/functional/SessionTimeout";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  async function handleClick() {
    console.log("I got clicked");
  }

  return (
    <>
      <SessionTimeout />

      <div className={`${styles.container}`}>
        <div
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            {sidebarOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
          </button>

          {sidebarOpen ? (
            <div className={styles.sidebarContent}>
              <div className={styles.item}>
                <button className={styles.opennedButton} onClick={handleClick}>
                  <AnalyticsOutlinedIcon className={styles.icon} />
                  <p className={styles.text}>Dashboard</p>
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.closedSidebarContent}>
              <div className={styles.item}>
                <button className={styles.closedButton} onClick={handleClick}>
                  <AnalyticsOutlinedIcon className={styles.icon} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className={`${styles.content} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          <div className={styles.main}>
            <h1 className={styles.welcome}>
              Welcome, {session?.user?.name} {session?.user?.agentid}!
            </h1>
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
      </div>
    </>
  );
}
