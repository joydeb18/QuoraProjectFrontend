'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute"; // Role-based access
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

// New Post Interface
interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  imageUrl?: string;
}

const DashboardPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // New states for posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const getAuthHeaders = () => {
    const token = localStorage.getItem('blog_token');
    if (!token) throw new Error("Aap logged-in nahi hain.");
    return { 'x-auth-token': token } as Record<string, string>;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError('');
      try {
        const headers = getAuthHeaders();
        const res = await axios.get(`${backendUrl}/api/categories`, { headers });
        const list = res.data?.categories || [];
        setCategories(Array.isArray(list) ? list : []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Categories load karne mein problem aayi.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRecentPosts = async () => {
      setIsPostsLoading(true);
      setPostsError('');
      try {
        const headers = getAuthHeaders();
        // Assuming an API endpoint for fetching recent posts
        const res = await axios.get(`${backendUrl}/api/posts?limit=6`, { headers }); // Fetching 6 recent posts
        const list = res.data?.posts || [];
        setPosts(Array.isArray(list) ? list : []);
      } catch (err: any) {
        setPostsError(err.response?.data?.message || 'Recent posts load karne mein problem aayi.');
      } finally {
        setIsPostsLoading(false);
      }
    };

    fetchCategories();
    fetchRecentPosts(); // Call to fetch recent posts
  }, [backendUrl]);

  return (
    <RoleProtectedRoute requiredRole="user">
      <div className="p-4 md:p-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-10 text-center leading-tight">
          Discover & Explore Categories
        </h1>
        {isLoading ? (
          <p className="text-center">Loading categories...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-600">Abhi koi category nahi bani.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const slug = cat.slug || cat._id;
              return (
                <Link
                  key={cat._id}
                  href={`/posts/${encodeURIComponent(slug)}`}
                  className="block relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                             bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400 group"
                >
                  <>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{cat.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">Explore posts in this category &rarr;</p>
                    </div>
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </>
                </Link>
              );
            })}
          </div>
        )}

        {/* Recent Posts Section */}
        <h2 className="text-4xl font-extrabold text-gray-900 mt-16 mb-8 text-center leading-tight">
          Recent Posts
        </h2>
        {isPostsLoading ? (
          <p className="text-center">Loading recent posts...</p>
        ) : postsError ? (
          <p className="text-center text-red-500">{postsError}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-600">Abhi koi recent post nahi hai.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link href={`/posts/view/${post._id}`} className="block relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                              bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400 group">
                <div key={post._id}>
                  {post.imageUrl && <img src={`${backendUrl}/${post.imageUrl}`} alt={post.title} className="w-full h-48 object-cover mb-4 rounded"/>}
                  <div className="p-4">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{post.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">By {post.author.username}</p>
                    <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + '...' }} />
                    <span className="text-blue-500 hover:underline mt-4 inline-block font-semibold">Read More &rarr;</span>
                  </div>
                  <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
};

export default DashboardPage;