"use client";
import { useState } from "react";
import SessionTimeout from "@/app/components/functional/SessionTimeout";
import styles from "@/app/dashboard/DashboardLayout.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ImportantDevicesIcon from "@mui/icons-material/ImportantDevices";
import NavItem from "./components/NavItem";
import EuroIcon from "@mui/icons-material/Euro";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp"; // Importing the scroll-to-top icon

export default function DashboardLayout({ children }) {
  const storedSidebarState =
    typeof window !== "undefined"
      ? sessionStorage.getItem("sidebarOpen") === "true"
      : false;
  const [sidebarOpen, setSidebarOpen] = useState(storedSidebarState);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => {
      sessionStorage.setItem("sidebarOpen", !prevState);
      return !prevState;
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navItems = [
    {
      Icon: AnalyticsOutlinedIcon,
      text: "Analytics",
      href: "/dashboard/analytics",
    },
    { Icon: TrendingUpIcon, text: "Sales", href: "/dashboard/sales" },
    { Icon: ImportantDevicesIcon, text: "Devices", href: "/dashboard/devices" },
    { Icon: EuroIcon, text: "CRM", href: "/crm", inactive: true },
  ];

  const renderNavItems = (isSidebarOpen) =>
    navItems.map((item, index) => (
      <NavItem
        key={index}
        Icon={item.Icon}
        text={isSidebarOpen ? item.text : null}
        href={item.href}
        isSidebarOpen={isSidebarOpen}
        inactive={item.inactive}
      />
    ));

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

          <div
            className={
              sidebarOpen ? styles.sidebarContent : styles.closedSidebarContent
            }
          >
            {renderNavItems(sidebarOpen)}
          </div>

          <button
            onClick={scrollToTop}
            className={
              sidebarOpen
                ? styles.scrollToTopButtonClosed
                : styles.scrollToTopButtonOpen
            }
            aria-label="Scroll to top"
          >
            <ArrowCircleUpIcon
              fontSize="large"
              style={{ verticalAlign: "top" }}
            />
          </button>
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
