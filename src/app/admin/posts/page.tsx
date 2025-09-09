'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

// Post ka structure
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
            setIsLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) {
                    throw new Error("Aap logged-in nahi hain. Please login karein.");
                }

                const headers = { 'x-auth-token': token };
                
                const response = await axios.get('https://quoraproject-production.up.railway.app/api/posts', { headers });
                
                console.log("API Response Data:", response.data);

                // === YAHI ASLI CHANGE HAI ===
                // Hum ab seedha response.data.posts ko check kar rahe hain,
                // kyunki console se pata chala ki posts iske andar hain.
                if (response.data && Array.isArray(response.data.posts)) {
                    setPosts(response.data.posts); 
                } else {
                    console.error("API response mein 'posts' key nahi hai ya woh ek array nahi hai:", response.data);
                    throw new Error("API se mila data format sahi nahi hai.");
                }
                
            } catch (err: any) {
                console.error("Posts fetch karne mein error:", err);
                setError(err.response?.data?.message || err.message || "Posts load karne mein problem aayi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Baaki ka JSX code waisa hi hai, usmein koi change nahi hai
    return (
        <RoleProtectedRoute requiredRole="admin">
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">Post Management</h1>
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/posts/new" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition">
                            + Create New Post
                        </Link>
                        <Link href="/admin/dashboard" className="text-indigo-600 hover:underline">
                            &larr; Back to Dashboard
                        </Link>
                    </div>
                </div>
                
                <div className="mt-8 overflow-hidden rounded-lg bg-white shadow-md">
                    {isLoading ? (
                        <p className="text-center py-10">Posts load ho rahe hain...</p>
                    ) : error ? (
                        <p className="text-red-500 text-center py-10">{error}</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Title</th>
                                        <th className="py-3 px-4 border-b text-sm font-semibold text-gray-600">Author</th>
                                        <th className="py-3 px-4 border-b text-sm font-semibold text-gray-600">Date</th>
                                        <th className="py-3 px-4 border-b text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                 {posts.length > 0 ? (
                                     posts.map((post) => (
                                         <tr key={post._id} className="text-center hover:bg-gray-50">
                                             <td className="py-3 px-4 border-b text-left font-medium text-gray-800">{post.title}</td>
                                             <td className="py-3 px-4 border-b text-gray-600">{post.author?.username || 'N/A'}</td>
                                             <td className="py-3 px-4 border-b text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</td>
                                             <td className="py-3 px-4 border-b">
                                                 <Link href={`/admin/posts/view/${post._id}`} className="text-indigo-600 hover:underline font-semibold">
                                                     View / Edit
                                                 </Link>
                                             </td>
                                         </tr>
                                     ))
                                 ) : ( 
                                     <tr>
                                         <td colSpan={4} className="text-center py-10 text-gray-500">
                                             Database mein koi post nahi mila.
                                         </td>
                                     </tr>
                                 )}
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