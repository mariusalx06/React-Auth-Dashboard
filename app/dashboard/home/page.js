"use client";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import styles from "./page.module.css";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <DashboardLayout>
      <h1 className={styles.welcome}>
        Welcome, {session?.user?.name} {session?.user?.agentid}!
      </h1>
      <p className={styles.message}>
        You are now logged in and viewing your dashboard.
      </p>
    </DashboardLayout>
  );
}
