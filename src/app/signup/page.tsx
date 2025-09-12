'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Backend ka URL Vercel se le rahe hain
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      // 'localhost' ko naye variable se replace kiya
      const response = await axios.post(`${backendUrl}/signup`, {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#121212'}}>
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md" style={{backgroundColor: '#1E1E1E'}}>
        <h1 className="text-2xl font-bold text-center" style={{color: '#FFFFFF'}}>Create a New Account</h1>
        <form onSubmit={handleSignup} className="space-y-6">
            <div>
                <label htmlFor="username" style={{color: '#B0B0B0'}}>Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" style={{backgroundColor: '#2E2E2E', borderColor: '#FF9800', color: '#FFFFFF'}} />
            </div>
            <div>
                <label htmlFor="email" style={{color: '#B0B0B0'}}>Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" style={{backgroundColor: '#2E2E2E', borderColor: '#FF9800', color: '#FFFFFF'}} />
            </div>
            <div>
                <label htmlFor="password" style={{color: '#B0B0B0'}}>Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" style={{backgroundColor: '#2E2E2E', borderColor: '#FF9800', color: '#FFFFFF'}} />
            </div>
            <button type="submit" className="w-full py-2 font-medium rounded-md disabled:opacity-50" style={{backgroundColor: '#FF9800', color: '#FFFFFF'}} disabled={isLoading} onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#FFB74D')} onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#FF9800')}>{isLoading ? 'Creating Account...' : 'Sign Up'}</button>
        </form>
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <p className="text-center text-sm pt-4" style={{color: '#B0B0B0'}}>Already have an account?{' '} <Link href="/login" className="font-medium hover:opacity-80" style={{color: '#FF9800'}}>Login here</Link></p>
      </div>
    </main>
  );
};

export default SignupPage;