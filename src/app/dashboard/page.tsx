'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

// Post ke data type ke liye interface
interface Post {
  _id: string;
  title: string;
  content: string; // Content bhi chahiye snippet ke liye
  author: {
    username: string;
  };
  createdAt: string;
  imageUrl?: string;
}

const DashboardPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Aap logged-in nahi hain.");
                
                const headers = { 'x-auth-token': token };
                // Yeh API call ab normal user bhi kar sakta hai
                const response = await axios.get(`${backendUrl}/api/posts`, { headers });
                
                setPosts(response.data.posts);
            } catch (err: any) {
                setError(err.response?.data?.message || "Posts ko fetch karne mein problem aayi.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // HTML content se tags hatakar text ka snippet banane ke liye function
    const createSnippet = (htmlContent: string, length: number = 150) => {
        const text = htmlContent.replace(/<[^>]+>/g, ''); // HTML tags ko hata do
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    return (
      // Hum bouncer ko bata rahe hain ki is page ke liye 'user' ka role zaroori hai
      <RoleProtectedRoute requiredRole="user">
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Latest Posts from Our Blog</h1>
            
            {isLoading ? ( <p className="text-center">Loading posts...</p> ) :
             error ? ( <p className="text-center text-red-500">{error}</p> ) :
            (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.length > 0 ? posts.map((post) => (
                        // Har post ke liye ek stylish card
                        <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105">
                            {post.imageUrl && (
                                <Link href={`/posts/view/${post._id}`}>
                                    <img src={`${backendUrl}/${post.imageUrl}`} alt={post.title} className="w-full h-48 object-cover"/>
                                </Link>
                            )}
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    By {post.author?.username || 'Unknown'} on {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-gray-700 flex-grow">
                                    {createSnippet(post.content)}
                                </p>
                                <div className="mt-4">
                                    {/* Yeh link naye 'View Post' page par le jayega */}
                                    <Link href={`/posts/view/${post._id}`} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Read More &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="col-span-3 text-center text-gray-500">Abhi tak koi post publish nahi hua hai.</p>
                    )}
                </div>
            )}
        </div>
      </RoleProtectedRoute>
    );
};

export default DashboardPage;