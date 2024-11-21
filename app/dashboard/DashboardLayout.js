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
import ImportantDevicesIcon from "@mui/icons-material/ImportantDevices";
import NavItem from "./components/NavItem";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import EuroIcon from "@mui/icons-material/Euro";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
    console.log(session);
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
                isSidebarOpen={sidebarOpen}
              />
              <NavItem
                Icon={TrendingUpIcon}
                text="Sales"
                href="/dashboard/sales"
                isSidebarOpen={sidebarOpen}
              />
              <NavItem
                Icon={ImportantDevicesIcon}
                text="Devices"
                href="/dashboard/devices"
                isSidebarOpen={sidebarOpen}
              />
              <NavItem
                Icon={EuroIcon}
                text="CRM"
                href="/crm"
                inactive={true}
                isSidebarOpen={sidebarOpen}
              />
            </div>
          ) : (
            <div className={styles.closedSidebarContent}>
              <NavItem
                Icon={AnalyticsOutlinedIcon}
                href="/dashboard/analytics"
                isSidebarOpen={sidebarOpen}
              />
              <NavItem
                Icon={TrendingUpIcon}
                onClick={handleClick}
                href="/dashboard/sales"
                isSidebarOpen={sidebarOpen}
              />
              <NavItem
                Icon={ImportantDevicesIcon}
                onClick={handleClick}
                href="/dashboard/devices"
                isSidebarOpen={sidebarOpen}
              />
              <NavItem
                Icon={EuroIcon}
                href="/crm"
                inactive={true}
                isSidebarOpen={sidebarOpen}
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
