'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute"; // <<< PATH THEEK KAR DIYA HAI
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  _id: string;
  title: string;
  author: { username: string };
  createdAt: string;
}

const AllPostsPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Aap logged-in nahi hain.");

                const headers = { 'x-auth-token': token };
                const response = await axios.get('http://localhost:5000/api/posts', { headers });
                
                setPosts(response.data.posts);
            } catch (err: any) {
                // JAASOOS: Browser ke console mein poora error dikhao
                console.error("Posts fetch karne mein error:", err);
                setError(err.response?.data?.message || "Posts ko fetch karne mein problem aayi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
      <RoleProtectedRoute requiredRole="admin">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800">Post Management</h1>
            <div className="flex items-center space-x-4">
                <Link href="/admin/posts/new" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition">
                    Create New Post
                </Link>
                <Link href="/admin/dashboard" className="text-indigo-600 hover:underline">
                    &larr; Back to User Management
                </Link>
            </div>
          </div>
          
          <div className="mt-8 border rounded-lg p-4 bg-white shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Blog Posts</h2>
            {isLoading ? ( <p className="text-center py-4">Loading posts...</p> ) : 
             error ? ( <p className="text-red-500 text-center py-4">{error}</p> ) : 
            (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                   <thead className="bg-gray-200"><tr><th className="py-2 px-4 border text-left">Title</th><th className="py-2 px-4 border">Author</th><th className="py-2 px-4 border">Date</th><th className="py-2 px-4 border">Actions</th></tr></thead>
                   <tbody>
                    {posts.length > 0 ? posts.map((post) => (
                      <tr key={post._id} className="text-center hover:bg-gray-50">
                        <td className="py-2 px-4 border text-left font-medium">{post.title}</td><td className="py-2 px-4 border">{post.author?.username || 'N/A'}</td><td className="py-2 px-4 border">{new Date(post.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border"><Link href={`/admin/posts/view/${post._id}`} className="text-green-600 hover:underline font-semibold">View Post</Link></td>
                      </tr>
                    )) : ( <tr><td colSpan={4} className="text-center py-8 text-gray-500">Abhi tak koi post nahi banaya gaya hai.</td></tr>)}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </RoleProtectedRoute>
    );
  };
  
  export default AllPostsPage;