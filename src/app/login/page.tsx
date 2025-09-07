'use client';

import { useState, useEffect } from 'react'; // useEffect ko import karna zaroori hai
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode'; // Token ko padhne ke liye (agar install na ho to 'npm install jwt-decode' chalaayein)

const LoginPage = () => {
  const router = useRouter();
  
  // Form ke data ke liye States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // Messages aur Loading ke liye States
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // === NAYI STATE ===
  // Yeh state check karegi ki authentication check ho raha hai ya nahi
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // === YEH HAI NAYA JAASOOS (useEffect) ===
  // Yeh function page load hote hi sirf ek baar chalta hai.
  useEffect(() => {
    // 1. Browser ki memory se token dhoondho
    const token = localStorage.getItem('blog_token');

    // 2. Agar token mil gaya
    if (token) {
      try {
        // 3. Token ke andar jhaank kar dekho ki user ka role kya hai
        const decodedToken: { user: { role: string } } = jwtDecode(token);
        const userRole = decodedToken.user.role;

        // 4. Role ke hisaab se usse uske sahi dashboard par bhej do
        if (userRole === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        // Agar token kharab ya galat hai, toh usse hata do aur login karne do
        localStorage.removeItem('blog_token');
        localStorage.removeItem('blog_user');
        setIsCheckingAuth(false);
      }
    } else {
      // 5. Agar token nahi mila, toh matlab user logged-out hai.
      // Ab login form dikha sakte hain.
      setIsCheckingAuth(false);
    }
  }, [router]); // Dependency array mein router daala hai

  const handleLogin = async (event: React.FormEvent) => {
    // ... (aapka handleLogin function jaisa tha, bilkul waisa hi rahega) ...
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const payload = {
      email,
      password: isAdminLogin ? undefined : password,
      masterKey: isAdminLogin ? masterKey : undefined,
    };
    try {
      const response = await axios.post('http://localhost:5000/login', payload);
      const { token, user } = response.data;
      localStorage.setItem('blog_token', token);
      localStorage.setItem('blog_user', JSON.stringify(user));
      if (user && user.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  // === YEH HAI NAYA LOADING UI ===
  // Jab tak Jaasoos (useEffect) apni checking poori nahi kar leta,
  // tab tak hum ek loading screen dikhayenge.
  if (isCheckingAuth) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold">Checking authentication...</p>
      </main>
    );
  }

  // Jab checking poori ho jaye, tab login form dikhao.
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login to Your Account</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
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
          {/* Conditional Input (Password or Master Key) */}
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