'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation"; // isse hum URL se ID nikaalenge

// Post ke data type ke liye ek interface
interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
}

const ViewPostPage = () => {
    const params = useParams(); // URL se parameters nikaalne ke liye
    const postId = params.id; // Post ki ID nikaali

    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!postId) return; // Agar ID na mile toh kuch mat karo

        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Aap logged-in nahi hain.");
                
                const headers = { 'x-auth-token': token };
                // Naye API route ko call kar rahe hain
                const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, { headers });
                
                setPost(response.data.post);
            } catch (err: any) {
                setError(err.response?.data?.message || "Post ko fetch karne mein problem aayi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    if (isLoading) {
        return <div className="text-center py-10">Loading post...</div>;
    }
    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
      <RoleProtectedRoute requiredRole="admin">
        <div className="p-4 md:p-8">
            <Link href="/admin/posts" className="text-indigo-600 hover:underline mb-6 inline-block">
              &larr; Back to All Posts
            </Link>
          
          {/* === YEH HAI STYLISH POST CARD === */}
          {post && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Yahan hum future mein image laga sakte hain */}
                {/* <img src="..." alt={post.title} className="w-full h-64 object-cover" /> */}

                <div className="p-6 md:p-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                    <div className="flex items-center text-gray-500 text-sm mb-6">
                        <span>By {post.author?.username || 'Unknown'}</span>
                        <span className="mx-2">&bull;</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {/* Post ka content */}
                    <div className="prose lg:prose-xl max-w-full">
                       <p>{post.content}</p>
                    </div>
                </div>
            </div>
          )}
        </div>
      </RoleProtectedRoute>
    );
  };
  
  export default ViewPostPage;