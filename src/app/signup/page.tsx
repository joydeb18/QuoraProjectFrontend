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
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Create a New Account</h1>
        <form onSubmit={handleSignup} className="space-y-6">
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
            </div>
            <button type="submit" className="w-full py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Sign Up'}</button>
        </form>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        <p className="text-center text-sm text-gray-600 pt-4">Already have an account?{' '} <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login here</Link></p>
      </div>
    </main>
  );
};

export default SignupPage;