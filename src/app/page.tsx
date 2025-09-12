// src/app/page.tsx

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-20 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">Welcome to JoyBlog</h1>
        <p className="text-xl text-gray-800 mb-8">
          Your one-stop destination for all things tech.
        </p>
        <a 
          href="/login" 
          className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300"
        >
          Explore Posts
        </a>
      </section>
    </div>
  );
}