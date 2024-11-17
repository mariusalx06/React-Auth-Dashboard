'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


export default function Home() {
  const router = useRouter();

  const handleDashboardClick = () => {
      router.push('/dashboard');
  };

  return (
    <div className="landing-container">
      <h1>Welcome to Marius's Dashboard App</h1>
      <div className="buttons-container">

        <button onClick={handleDashboardClick}>Go to Dashboard</button>
      
      </div>
    </div>
  );
}

