'use client';  // This marks the component as a client component

// Inside Home.js
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  console.log("Home component: status", status);
  console.log("Home component: session", session);

  const handleLoginClick = () => {
    router.push('/auth/signin');  // Redirect to login page
  };

  const handleRegisterClick = () => {
    router.push('/auth/register');  // Redirect to register page
  };

  const handleDashboardClick = () => {
    if (session) {
      router.push('/dashboard');  // Redirect to dashboard if logged in
    } else {
      router.push('/auth/signin');  // Redirect to login if not logged in
    }
  };

  return (
    <div className="landing-container">
      <h1>Welcome to Our App!</h1>
      <div className="buttons-container">
        <button onClick={handleLoginClick}>Login</button>
        <button onClick={handleRegisterClick}>Register</button>
        
        {/* Only show the Dashboard button if the user is logged in */}
        {session ? (
          <button onClick={handleDashboardClick}>Go to Dashboard</button>
        ) : (
          <p>Please log in to access the Dashboard.</p>
        )}
      </div>
    </div>
  );
}

