'use client'

import { SessionProvider } from 'next-auth/react';
import SessionStatus from '@/app/components/SessionStatus';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import './globals.css';

export default function Layout({ children }) {

  const pathname = usePathname();
  const [isSessionStatusActive, setIsSessionStatusActive] = useState(false);

  useEffect(() => {
    if (pathname === '/') {
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
        </head>
        <body>
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
