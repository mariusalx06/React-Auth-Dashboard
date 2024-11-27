"use client";
import { useState, useEffect } from "react";
import SessionTimeout from "@/app/components/functional/SessionTimeout";
import styles from "@/app/dashboard/DashboardLayout.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ImportantDevicesIcon from "@mui/icons-material/ImportantDevices";
import NavItem from "./components/NavItem";
import EuroIcon from "@mui/icons-material/Euro";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedSidebarState = sessionStorage.getItem("sidebarOpen") === "true";
    setSidebarOpen(storedSidebarState);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => {
      const newState = !prevState;
      sessionStorage.setItem("sidebarOpen", newState);
      return newState;
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
    { Icon: ManageAccountsIcon, text: "CRM", href: "/crm" },
    { Icon: EuroIcon, text: "Plans", href: "/dashboard/plans" },
  ];

  const renderNavItems = (isSidebarOpen) =>
    navItems.map((item, index) => (
      <NavItem
        key={index}
        Icon={item.Icon}
        text={isSidebarOpen ? item.text : null}
        href={item.href}
        isSidebarOpen={isSidebarOpen}
        target={item.text === "CRM" ? "_blank" : "_self"}
      />
    ));

  return (
    <>
      <SessionTimeout />

      <div
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
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
      </div>

      <div
        className={`${styles.content} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        {children}
      </div>
    </>
  );
}
