'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // === YEH HAI ASLI BADLAV ===
    // Sirf browser mein hi localStorage check karo
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('blog_token');
        if (token) {
          setIsLoggedIn(true);
        }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('blog_token');
    localStorage.removeItem('blog_user');
    window.location.href = '/login'; 
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600">
          JoyBlog
        </Link>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <Link href="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
          <Link href="/about" className="text-gray-600 hover:text-indigo-600">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-indigo-600">Contact</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
              Logout
            </button>
          ) : (
            <Link href="/login" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
              Signup/Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;