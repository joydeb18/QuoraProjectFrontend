'use client';

// src/app/page.tsx

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-20 rounded-lg shadow-lg" style={{backgroundColor: '#1E1E1E'}}>
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4" style={{color: '#FFFFFF'}}>Welcome to JoyBlog</h1>
        <p className="text-xl mb-8" style={{color: '#B0B0B0'}}>
          Your one-stop destination for all things tech.
        </p>
        <a 
          href="/login" 
          className="font-bold py-3 px-8 rounded-full transition duration-300"
          style={{backgroundColor: '#FF9800', color: '#FFFFFF'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFB74D'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
        >
          Explore Posts
        </a>
      </section>
    </div>
  );
}