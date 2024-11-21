"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import SessionTimeout from "@/app/components/functional/SessionTimeout";
import { useRouter } from "next/navigation";
import styles from "@/app/dashboard/DashboardLayout.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import NavItem from "./components/NavItem";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function DashboardLayout({ children }) {
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

      <div className={styles.container}>
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
              <NavItem
                Icon={AnalyticsOutlinedIcon}
                text="Analytics"
                href="/dashboard/analytics"
              />
              <NavItem
                Icon={TrendingUpIcon}
                text="Sales"
                href="/dashboard/sales"
              />
              <NavItem
                Icon={GroupsIcon}
                text="Customers"
                href="/dashboard/customers"
              />
            </div>
          ) : (
            <div className={styles.closedSidebarContent}>
              <NavItem
                Icon={AnalyticsOutlinedIcon}
                href="/dashboard/analytics"
              />
              <NavItem
                Icon={TrendingUpIcon}
                onClick={handleClick}
                href="/dashboard/sales"
              />
              <NavItem
                Icon={GroupsIcon}
                onClick={handleClick}
                href="/dashboard/customers"
              />
            </div>
          )}

          {status === "authenticated" && (
            <div className={styles.buttons}>
              <button
                className={styles.logoutButton}
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
              >
                {sidebarOpen ? (
                  <>
                    <ExitToAppIcon className={styles.logOutIcon} /> Log Out
                  </>
                ) : (
                  <ExitToAppIcon className={styles.logOutIcon} />
                )}
              </button>
            </div>
          )}
        </div>

        <div
          className={`${styles.content} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          <div className={styles.main}>{children}</div>
        </div>
      </div>
    </>
  );
}
