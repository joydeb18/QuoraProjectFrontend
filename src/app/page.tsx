// src/app/page.tsx

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-20 bg-white rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to MeraBlog</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your one-stop destination for all things tech.
        </p>
        <a 
          href="#latest-posts" 
          className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300"
        >
          Explore Posts
        </a>
      </section>

      {/* Latest Posts Section */}
      <section id="latest-posts" className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>
        <div className="text-center p-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">Yahan par humare blog posts aayenge...</p>
          <p className="text-gray-400 mt-2">(Abhi ke liye yeh placeholder hai)</p>
        </div>
      </section>
    </div>
  );
}