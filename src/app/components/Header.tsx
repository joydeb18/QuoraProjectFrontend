// src/components/Header.tsx

import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          MeraBlog
        </Link>
        <nav>
          <Link href="/" className="px-4 text-gray-600 hover:text-blue-500">
            Home
          </Link>
          <Link href="/about" className="px-4 text-gray-600 hover:text-blue-500">
            About
          </Link>
          <Link href="/contact" className="px-4 text-gray-600 hover:text-blue-500">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;