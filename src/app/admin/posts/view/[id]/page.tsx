'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

// Hata di gayi line (Yahi badlav hai)
// import 'react-quill/dist/quill.snow.css'; 

// Post ka structure kaisa hoga
interface Post {
    _id: string;
    title: string;
    content: string;
    author: { username: string; };
    createdAt: string;
    imageUrls?: string[];
}

const ViewPostPage = () => {
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string;

    // State variables
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

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

                setPost(response.data.post);

            } catch (err: any) {
                setError(err.response?.data?.message || "Post fetch karne mein problem aayi.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [postId, backendUrl]);

    // Post delete karne ke liye function
    const handleDelete = async () => {
        if (window.confirm("Kya aap sach mein is post ko delete karna chahte hain?")) {
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Aap logged-in nahi hain.");

                await axios.delete(`${backendUrl}/api/posts/${postId}`, {
                    headers: { 'x-auth-token': token }
                });

                alert("Post successfully delete ho gaya!");
                router.push('/admin/posts');
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
                            <div className="flex items-center space-x-4">
                                <Link href={`/admin/posts/edit/${post._id}`} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                                    Edit Post
                                </Link>
                                <button onClick={handleDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">
                                    Delete Post
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {post.imageUrls && post.imageUrls.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {post.imageUrls.map((url, index) => (
                                        <img
                                            key={index}
                                            src={`${backendUrl}/${url}`}
                                            alt={`Post image ${index + 1}`}
                                            className="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-md"
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="p-6 md:p-8">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                                <div className="flex items-center text-gray-500 text-sm mb-6">
                                    <span>By {post.author?.username || 'Unknown Author'}</span>
                                    <span className="mx-2">&bull;</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                {/* Yeh 'prose' class ab saari styling karegi */}
                                <div className="prose lg:prose-xl max-w-full text-gray-800"
                                     dangerouslySetInnerHTML={{ __html: post.content }}
                                />
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