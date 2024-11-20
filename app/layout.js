"use client";

import { SessionProvider } from "next-auth/react";
import SessionStatus from "@/app/components/functional/SessionStatus";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import "./globals.css";
import Header from "./components/style/Header";
import Footer from "./components/style/Footer";

export default function Layout({ children }) {
  const pathname = usePathname();
  const [isSessionStatusActive, setIsSessionStatusActive] = useState(false);

  useEffect(() => {
    if (pathname === "/") {
      const timer = setTimeout(() => {
        setIsSessionStatusActive(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsSessionStatusActive(true);
    }
  }, [pathname]);

  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <title>Marius's Auth Dashboard App</title>
          <meta name="description" content="Marius's first Auth Application" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=Geist+Mono:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <Header />
          {isSessionStatusActive ? (
            <SessionStatus>{children}</SessionStatus>
          ) : (
            children
          )}
        </body>
      </html>
    </SessionProvider>
  );
}
