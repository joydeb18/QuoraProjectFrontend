'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation"; // useRouter ko import kiya

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
    const params = useParams();
    const router = useRouter(); // router ko initialize kiya
    const postId = params.id;

    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Aap logged-in nahi hain.");
                
                const headers = { 'x-auth-token': token };
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

    // === YEH NAYA DELETE FUNCTION HAI ===
    const handleDelete = async () => {
        // User se confirmation lena
        if (window.confirm('Are you sure you want to permanently delete this post?')) {
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Aap logged-in nahi hain.");

                const headers = { 'x-auth-token': token };
                // Backend ke naye delete API route ko call karna
                await axios.delete(`http://localhost:5000/api/posts/${postId}`, { headers });

                alert('Post successfully delete ho gaya!');
                // Success hone par 'All Posts' page par wapas bhej do
                router.push('/admin/posts');

            } catch (err: any) {
                alert(err.response?.data?.message || "Post ko delete karne mein problem aayi.");
            }
        }
    };


    if (isLoading) {
        return <div className="text-center py-10">Loading post...</div>;
    }
    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
      <RoleProtectedRoute requiredRole="admin">
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <Link href="/admin/posts" className="text-indigo-600 hover:underline">
                  &larr; Back to All Posts
                </Link>
                {/* === YEH NAYA DELETE BUTTON HAI === */}
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >
                    Delete Post
                </button>
            </div>
          
          {/* Stylish Post Card */}
          {post && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                    <div className="flex items-center text-gray-500 text-sm mb-6">
                        <span>By {post.author?.username || 'Unknown'}</span>
                        <span className="mx-2">&bull;</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
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