'use client'; // Mark as client component

import { SessionProvider } from 'next-auth/react';
import SessionStatus from '@/app/components/SessionStatus'; // Import the SessionStatus component
import './globals.css';  // Import global styles if any

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <title>Marius's Auth Dashboard App</title>
          <meta name="description" content="Marius's first Auth Application" />
        </head>
        <body>
          <SessionStatus>{children}</SessionStatus>  {/* Wrap the children with SessionStatus */}
        </body>
      </html>
    </SessionProvider>
  );
}
