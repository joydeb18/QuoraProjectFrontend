// Step 1: Component ko 'use client' banana zaroori hai taaki yeh browser mein chal sake
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react'; // Hum 'useState' aur 'useEffect' hooks ka istemaal karenge
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  // Step 2: Header ki apni "memory" banayi, jismein woh yaad rakhega ki user logged-in hai ya nahi
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Step 3: Yeh "jaasoos" (useEffect) page load hote hi sirf ek baar chalega
  useEffect(() => {
    // Browser ki memory se token (ticket) dhoondho
    const token = localStorage.getItem('blog_token');
    
    // Agar token mila, toh Header ki memory (state) mein 'true' set kar do
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // Khaali array ka matlab hai ki yeh jaasoos page ke refresh hone par dobara nahi chalega

  // Step 4: Logout ka function
  const handleLogout = () => {
    // Browser ki memory se token aur user data, dono ko hata do
    localStorage.removeItem('blog_token');
    localStorage.removeItem('blog_user'); // User data bhi remove karna aachi practice hai
    
    // User ko wapas login page par bhej do
    window.location.href = '/login'; 
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600">
          JoyBlog
        </Link>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <Link href="/" className="text-gray-600 hover:text-indigo-600">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-indigo-600">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-indigo-600">
            Contact
          </Link>
          
          {/* === YEH HAI ASLI LOGIC === */}
          {isLoggedIn ? (
            // Agar user logged-in hai (isLoggedIn true hai)
            <button
              onClick={handleLogout}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Logout
            </button>
          ) : (
            // Agar user logged-out hai (isLoggedIn false hai)
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