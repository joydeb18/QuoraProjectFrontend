// 'use client' likhna zaroori hai
'use client';

import { useState } from 'react';
// Step A: Axios ko import karo
import axios from 'axios';

export default function SignupPage() {
  // State variables waise hi rahenge
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form submit handle karne wala function (ab axios ke saath)
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    
    setMessage('');
    setError('');

    try {
      // Step B: axios.post ka use karke API call karna
      // Pehla argument: backend ka URL
      // Dusra argument: data jo bhejna hai (JavaScript object)
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password,
      });

      // Step C: Axios se response seedha .data property me milta hai
      // Humein response.json() karne ki zaroorat nahi hai
      setMessage(response.data.message);
      
      // Success hone par form fields ko clear kar do
      setUsername('');
      setEmail('');
      setPassword('');

    } catch (err: any) {
      // Step D: Axios me error handling aasan hai
      // Agar backend se koi bhi error (400, 500 etc.) aata hai,
      // to woh seedha catch block me aa jayega.
      if (err.response && err.response.data && err.response.data.message) {
        // Backend se bheja gaya error message
        setError(err.response.data.message);
      } else {
        // Network ya koi aur error
        setError('Signup failed. Network error ya server down ho sakta hai.');
      }
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Create Account (with Axios)</h1>
        
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Username Input */}
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
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
            className="w-full py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </form>

        {/* Success and Error Messages */}
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </div>
    </main>
  );
}