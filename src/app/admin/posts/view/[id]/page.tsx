'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

// ... (Post interface waisa hi rahega) ...
interface Post {
  _id: string;
  title: string;
  content: string;
  author: { username: string };
  createdAt: string;
  imageUrl?: string;
}


const ViewPostPage = () => {
    const params = useParams();
    const router = useRouter();
    const postId = params.id;
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const backendUrl = "http://localhost:5000";

    // ... (useEffect aur handleDelete functions waise hi rahenge) ...
    useEffect(() => {
        if (!postId) return;
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Aap logged-in nahi hain.");
                const headers = { 'x-auth-token': token };
                const response = await axios.get(`${backendUrl}/api/posts/${postId}`, { headers });
                setPost(response.data.post);
            } catch (err: any) {
                setError(err.response?.data?.message || "Post ko fetch karne mein problem aayi.");
            } finally { setIsLoading(false); }
        };
        fetchPost();
    }, [postId]);
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to permanently delete this post?')) {
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Aap logged-in nahi hain.");
                const headers = { 'x-auth-token': token };
                await axios.delete(`${backendUrl}/api/posts/${postId}`, { headers });
                alert('Post successfully delete ho gaya!');
                router.push('/admin/posts');
            } catch (err: any) { alert(err.response?.data?.message || "Post ko delete karne mein problem aayi."); }
        }
    };


    if (isLoading) { return <div className="text-center py-10">Loading post...</div>; }
    if (error) { return <div className="text-center py-10 text-red-500">{error}</div>; }

    return (
      <RoleProtectedRoute requiredRole="admin">
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Link href="/admin/posts" className="text-indigo-600 hover:underline">&larr; Back to All Posts</Link>
                <button onClick={handleDelete} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">Delete Post</button>
            </div>
          
          {post && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {post.imageUrl && (
                    <div className="bg-gray-100 p-4">
                        <img src={`${backendUrl}/${post.imageUrl}`} alt={post.title} className="w-full max-h-[500px] object-contain mx-auto rounded-md" />
                    </div>
                )}
                <div className="p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                    <div className="flex items-center text-gray-500 text-sm mb-6">
                        <span>By {post.author?.username || 'Unknown'}</span>
                        <span className="mx-2">&bull;</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {/* === YEH HAI NAYA BADLAV === */}
                    {/* Post ka HTML content ab 'dangerouslySetInnerHTML' se render hoga */}
                    <div 
                        className="prose lg:prose-xl max-w-full text-gray-800"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </div>
          )}
        </div>
      </RoleProtectedRoute>
    );
  };
  
  export default ViewPostPage;