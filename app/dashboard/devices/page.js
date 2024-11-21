"use client";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import styles from "./page.module.css";

export default function Customers() {
  const { data: session, status } = useSession();

  return (
    <DashboardLayout>
      <h1>Devices</h1>
    </DashboardLayout>
  );
}
