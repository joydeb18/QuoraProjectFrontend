'use client';

import { useState } from 'react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form submit karne par yeh function chalega (abhi ke liye placeholder)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    // Yahan hum future mein backend ko request bhejenge
    console.log("Password reset request for:", email);

    // 2 second ka farzi delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setMessage("If an account with that email exists, we have sent a password reset link.");
    setIsLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Forgot Your Password?
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            No problem! Just enter your email address below.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        
        <p className="text-center text-sm text-gray-600">
          Remembered your password?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;