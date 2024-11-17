'use client';  // Mark as client component because we use useSession and useRouter

import { useSession, signOut } from 'next-auth/react';
import SessionTimeout from '@/app/components/SessionTimeout';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    
    <div className="dashboard-container">
      <SessionTimeout />
      <h1>Welcome, {session?.user?.name}!</h1>
      <p>You are now logged in and viewing your dashboard.</p>
      {status === 'authenticated' && (
        <>
          <button
            onClick={() => {
              signOut({ callbackUrl: '/' }); 
            }}
          >
            Log Out
          </button>
          <button onClick={()=>{
            router.push('/');
          }}>
            Home
          </button>
        </>
      )}
    </div>
  );
}
