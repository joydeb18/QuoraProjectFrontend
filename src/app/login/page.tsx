'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Vercel ke "Notice Board" se backend ka address le rahe hain
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem('blog_token');
    if (token) {
      try {
        const decodedToken: { user: { role: string }, exp: number } = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('blog_token');
            localStorage.removeItem('blog_user');
            setIsCheckingAuth(false);
        } else {
            const userRole = decodedToken.user.role;
            if (userRole === 'admin') {
              router.push('/admin/dashboard');
            } else {
              router.push('/dashboard');
            }
        }
      } catch (err) {
        localStorage.removeItem('blog_token');
        localStorage.removeItem('blog_user');
        setIsCheckingAuth(false);
      }
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const payload = {
      email,
      password: isAdminLogin ? undefined : password,
      masterKey: isAdminLogin ? masterKey : undefined,
    };
    try {
      // 'localhost' ko naye variable se replace kar diya hai
      const response = await axios.post(`${backendUrl}/login`, payload);
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
  
  if (isCheckingAuth) {
    return (
      <main className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#121212'}}>
        <p className="text-xl font-semibold" style={{color: '#FFFFFF'}}>Checking authentication...</p>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#121212'}}>
        <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md" style={{backgroundColor: '#1E1E1E'}}>
            <h1 className="text-2xl font-bold text-center" style={{color: '#FFFFFF'}}>Login to Your Account</h1>
            <form onSubmit={handleLogin} className="space-y-6">
                 {/* Email Input */}
                 <div>
                    <label htmlFor="email" style={{color: '#B0B0B0'}}>Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" style={{backgroundColor: '#2E2E2E', borderColor: '#FF9800', color: '#FFFFFF'}} />
                </div>
                {/* Conditional Input (Password or Master Key) */}
                {isAdminLogin ? (
                    <div>
                        <label htmlFor="masterKey" style={{color: '#B0B0B0'}}>Master Key</label>
                        <input type="password" id="masterKey" value={masterKey} onChange={(e) => setMasterKey(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" style={{backgroundColor: '#2E2E2E', borderColor: '#FF9800', color: '#FFFFFF'}} />
                    </div>
                ) : (
                    <div>
                        <label htmlFor="password" style={{color: '#B0B0B0'}}>Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" style={{backgroundColor: '#2E2E2E', borderColor: '#FF9800', color: '#FFFFFF'}} />
                    </div>
                )}
                {/* Admin Login Checkbox and Forgot Password Link */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input type="checkbox" id="admin-login" checked={isAdminLogin} onChange={(e) => setIsAdminLogin(e.target.checked)} className="h-4 w-4 rounded" style={{accentColor: '#FF9800'}} />
                        <label htmlFor="admin-login" className="ml-2 block text-base" style={{color: '#B0B0B0'}}>Login as Admin</label>
                    </div>
                    <div className="text-sm">
                        <Link href="/forgot-password" className="font-medium hover:opacity-80" style={{color: '#FF9800'}}>Forgot password?</Link>
                    </div>
                </div>
                {/* Submit Button */}
                <button type="submit" className="w-full py-2 font-medium rounded-md disabled:opacity-50" style={{backgroundColor: '#FF9800', color: '#FFFFFF'}} disabled={isLoading} onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#FFB74D')} onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#FF9800')}>{isLoading ? 'Logging in...' : 'Login'}</button>
            </form>
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            <p className="text-center text-base" style={{color: '#B0B0B0'}}>Don't have an account?{' '} <Link href="/signup" className="font-medium hover:opacity-80" style={{color: '#FF9800'}}>Sign up here</Link></p>
        </div>
    </main>
  );
};

export default LoginPage;