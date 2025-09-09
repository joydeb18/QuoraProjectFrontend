'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

// Single Post ka structure
interface Post { 
    _id: string; 
    title: string; 
    content: string; 
    author: { username: string; }; 
    createdAt: string; 
    imageUrl?: string; 
}

const ViewPostPage = () => {
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string; // URL se post ki ID
    
    // State variables
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const backendUrl = "https://quoraproject-production.up.railway.app";

    // Component load hone par single post fetch karega
    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Aap logged-in nahi hain.");
                
                const response = await axios.get(`${backendUrl}/api/posts/${postId}`, {
                    headers: { 'x-auth-token': token }
                });

                //<-- YAHAN BADLAV KIYA GAYA HAI
                // API se aane wale response object se 'post' ko extract kiya ja raha hai.
                setPost(response.data.post); 
                
            } catch (err: any) {
                setError(err.response?.data?.message || "Post fetch karne mein problem aayi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    // Post delete karne ke liye function
    const handleDelete = async () => {
        // Delete karne se pehle confirmation
        if (window.confirm("Kya aap sach mein is post ko delete karna chahte hain?")) {
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Aap logged-in nahi hain.");

                await axios.delete(`${backendUrl}/api/posts/${postId}`, {
                    headers: { 'x-auth-token': token }
                });
                
                alert("Post successfully delete ho gaya!");
                router.push('/admin/posts'); // All posts page par redirect
            } catch (err: any) {
                alert(err.response?.data?.message || "Post delete karne mein problem aayi.");
            }
        }
    };

    if (isLoading) { return <div className="text-center py-10">Post load ho raha hai...</div>; }
    if (error) { return <div className="text-center py-10 text-red-500">{error}</div>; }

    return (
        <RoleProtectedRoute requiredRole="admin">
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                {post ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <Link href="/admin/posts" className="text-indigo-600 hover:underline">&larr; Back to All Posts</Link>
                            <button onClick={handleDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">
                                Delete Post
                            </button>
                        </div>
                      
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {post.imageUrl && (
                                <img src={`${backendUrl}/${post.imageUrl}`} alt={post.title} className="w-full h-auto max-h-[500px] object-cover" />
                            )}
                            <div className="p-6 md:p-8">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                                <div className="flex items-center text-gray-500 text-sm mb-6">
                                    <span>By {post.author?.username || 'Unknown Author'}</span>
                                    <span className="mx-2">&bull;</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                {/* 'whitespace-pre-wrap' se line breaks aur spaces preserve honge */}
                                <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                                   {post.content}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                     <div className="text-center py-10 text-gray-500">Post nahi mila.</div>
                )}
            </div>
        </RoleProtectedRoute>
    );
};
 
export default ViewPostPage;