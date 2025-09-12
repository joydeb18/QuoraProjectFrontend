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
    <header className="shadow-md sticky top-0 z-50" style={{backgroundColor: '#1E1E1E'}}>
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition" style={{color: '#FFFFFF'}}>
          JoyBlog
        </Link>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <Link href="/" className="hover:opacity-80 transition" style={{color: '#B0B0B0'}}>Home</Link>
          <Link href="/about" className="hover:opacity-80 transition" style={{color: '#B0B0B0'}}>About</Link>
          <Link href="/contact" className="hover:opacity-80 transition" style={{color: '#B0B0B0'}}>Contact</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="font-bold py-2 px-4 rounded-lg transition" style={{backgroundColor: '#FF9800', color: '#FFFFFF'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFB74D'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}>
              Logout
            </button>
          ) : (
            <Link href="/login" className="font-bold py-2 px-4 rounded-lg transition" style={{backgroundColor: '#FF9800', color: '#FFFFFF'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFB74D'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}>
              Signup/Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;