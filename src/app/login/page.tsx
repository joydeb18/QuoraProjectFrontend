'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  
  // 1. Form ka data yaad rakhne ke liye states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [masterKey, setMasterKey] = useState('');
  
  // 2. Nayi state, yeh yaad rakhegi ki user admin ki tarah login kar raha hai ya nahi
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // 3. Backend ko bhejne wala data taiyaar kar rahe hain
    const payload = {
      email,
      // Agar admin login hai, toh masterKey bhejo, warna password bhejo
      password: isAdminLogin ? undefined : password,
      masterKey: isAdminLogin ? masterKey : undefined,
    };

    try {
      const response = await axios.post('http://localhost:5000/login', payload);

      const { token, user } = response.data;
      localStorage.setItem('blog_token', token);

      // Role ke hisaab se redirection
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login to Your Account</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input (yeh hamesha dikhega) */}
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>

          {/* 4. Yahan humne condition lagayi hai */}
          {isAdminLogin ? (
            // Agar 'isAdminLogin' true hai, toh Master Key ka box dikhao
            <div>
              <label htmlFor="masterKey">Master Key</label>
              <input
                type="password"
                id="masterKey"
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                required // Admin ke liye yeh zaroori hai
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>
          ) : (
            // Agar 'isAdminLogin' false hai, toh normal Password ka box dikhao
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // Normal user ke liye yeh zaroori hai
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>
          )}

          {/* 5. Yeh hai humara naya checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="admin-login"
              checked={isAdminLogin}
              onChange={(e) => setIsAdminLogin(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="admin-login" className="ml-2 block text-sm text-gray-900">
              Login as Admin
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up here
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;

