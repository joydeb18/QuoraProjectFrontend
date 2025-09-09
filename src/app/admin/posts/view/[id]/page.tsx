'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

// ... (Post interface waisa hi rahega) ...
interface Post { _id: string; title: string; content: string; author: { username: string; }; createdAt: string; imageUrl?: string; }

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
        const fetchPost = async () => { /* ... */ };
        fetchPost();
    }, [postId]);
    const handleDelete = async () => { /* ... */ };


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
                        <span>By {post.author?.username || 'Unknown'}</span><span className="mx-2">&bull;</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {/* === YAHAN SE 'prose' CLASS HATA DI HAI === */}
                    <div className="text-gray-800 whitespace-pre-wrap">
                       {post.content}
                    </div>
                </div>
            </div>
          )}
        </div>
      </RoleProtectedRoute>
    );
};
  
export default ViewPostPage;