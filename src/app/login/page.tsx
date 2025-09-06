'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  
  // States to store user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [masterKey, setMasterKey] = useState('');
  
  // State to check if it's an admin login
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // States for messages and loading
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // Backend ko bhejne wala data taiyaar kar rahe hain
    const payload = {
      email,
      password: isAdminLogin ? undefined : password,
      masterKey: isAdminLogin ? masterKey : undefined,
    };

    try {
      const response = await axios.post('http://localhost:5000/login', payload);

      // Backend se token aur user ka object (jisme role hai) receive karna
      const { token, user } = response.data;
      
      // Token ko browser ki memory (localStorage) mein save karna
      localStorage.setItem('blog_token', token);

      // === YEH HAI ASLI REDIRECTION KA LOGIC ===
      // Faisla lene ka samay!
      if (user && user.role === 'admin') {
        // Agar user ka role 'admin' hai, toh usse admin dashboard par bhejo.
        router.push('/admin/dashboard');
      } else {
        // Warna usse normal user ke dashboard par bhejo.
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
          {/* Email Input (Always visible) */}
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

          {/* Conditional Input Field (Password or Master Key) */}
          {isAdminLogin ? (
            <div>
              <label htmlFor="masterKey">Master Key</label>
              <input
                type="password"
                id="masterKey"
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>
          )}

          {/* Admin Login Checkbox */}
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

          {/* Submit Button */}
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