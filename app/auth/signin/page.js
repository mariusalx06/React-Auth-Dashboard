'use client';  // Ensure this is a client component

import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const { status, data: session } = useSession();  // Get session data
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect user if already authenticated
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);  // Only run the effect when session status changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      // On successful sign-in, redirect to /dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      {status === 'loading' && <p>Loading...</p>} {/* Show loading text while session is being fetched */}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div>
        <button
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          disabled={isLoading}
        >
          Sign In with GitHub
        </button>
      </div>

      <p>
        Don't have an account? <a href="/auth/register">Register</a>
      </p>
    </div>
  );
}
