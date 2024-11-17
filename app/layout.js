'use client'; // Mark this file as a client component

import { SessionProvider } from 'next-auth/react';
import SessionTimeout from './components/SessionTimeout';  // Import the SessionTimeout component
import { useEffect, useState } from 'react';
import './globals.css';  // Import global styles if any

export default function Layout({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Ensure that the app only renders after hydration
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Optionally, show a loading spinner or return null to avoid hydration issues
    return <div>Loading...</div>;
  }

  return (
    <SessionProvider>
      <SessionTimeout />  {/* Add the SessionTimeout component here */}
      
      <html lang="en">
        <head>
          <title>Marius learning Auth</title>
          <meta name="description" content="Marius learns Auth" />
        </head>
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}