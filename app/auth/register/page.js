'use client'; // Mark as client component to use hooks like `useSession`

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';

export default function Register() {
  const { data: session, status } = useSession();  // Get session data
  const router = useRouter();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');  // Redirect to dashboard if logged in
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, name } = user;

    if (!email || !password || !name) {
      setError('All fields are required');
      return;
    }

    // Register the user via API
    try {
      const response = await axios.post('/api/auth/register', { email, password, name });
      if (response.data.success) {
        router.push('/auth/signin');  // Redirect to login page after successful registration
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Something went wrong');
    }
  };

  async function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevUserDetails) => {
      return {
        ...prevUserDetails,
        [name]: value,
      };
    });
  }

  const handleGitHubLogin = () => {
    signIn('github', { callbackUrl: '/dashboard' })
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>

      <div className="divider">or</div>

      <button onClick={handleGitHubLogin}>Register/LogIn with GitHub</button>
      <button onClick={()=>{router.push('/');}}>Home</button>

      {error && <p>{error}</p>}
    </div>
  );
}
