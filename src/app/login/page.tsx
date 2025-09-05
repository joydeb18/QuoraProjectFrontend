// Line 1: "use client" - Yeh line zaroori hai kyunki hum user interaction (form, button click) handle kar rahe hain.
'use client';

// Line 4: Zaroori cheezon ko import kar rahe hain.
import { useState } from 'react';
import axios from 'axios'; // Backend se baat karne ke liye.
import { useRouter } from 'next/navigation'; // User ko redirect karne ke liye.
import Link from 'next/link'; // Signup page par link karne ke liye.

// Line 9: Humara Login Page component.
const LoginPage = () => {
  // Line 11: useRouter hook, jisse hum user ko doosre page par bhej sakte hain.
  const router = useRouter();

  // Line 14: Form ka data aur state ko manage karne ke liye variables.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Line 18: User ko message (error, loading) dikhane ke liye states.
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Line 22: Yeh function tab chalega jab user "Login" button dabata hai.
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    
    setIsLoading(true); // Kaam shuru, loading...
    setError('');       // Purana error message saaf karo.

    try {
      // Line 30: Hum backend ke login API par user ka email aur password bhej rahe hain.
      // URL ko apne backend server ke URL se match karna.
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      // Line 37: Agar login sahi raha, toh backend humein ek 'token' dega.
      const { token } = response.data;
      
      // Line 40: Hum is token ko browser ki localStorage mein save kar rahe hain.
      // Yeh sabse zaroori step hai. Isse browser ko yaad rahega ki user logged-in hai.
      localStorage.setItem('blog_token', token);
      
      // Line 44: Login successful! Ab user ko dashboard page par bhej do.
      router.push('/dashboard');

    } catch (err: any) {
      // Line 48: Agar backend ne koi error bheja (jaise galat password), toh use screen par dikhao.
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Network error or server might be down.');
      }
    } finally {
      // Line 55: Kaam khatam, loading band karo.
      setIsLoading(false);
    }
  };

  return (
    // Yeh JSX/HTML ka structure bilkul aapke signup page jaisa hai.
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
          {/* Password Input */}
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
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        {/* Link to Signup Page */}
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

