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

    if (isLoading) { return <div className="text-center py-10" style={{color: '#FFFFFF'}}>Post load ho raha hai...</div>; }
    if (error) { return <div className="text-center py-10 text-red-500">{error}</div>; }

    return (
        <RoleProtectedRoute requiredRole="admin">
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                {post ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => router.back()}
                                className="px-4 py-2 rounded-md transition-colors"
                                style={{backgroundColor: '#FF9800', color: '#FFFFFF'}}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFB74D'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
                            >
                                &larr; Back
                            </button>
                            <div className="flex items-center space-x-4">
                                <Link href={`/admin/posts/edit/${post._id}`} className="font-bold py-2 px-4 rounded-lg transition" style={{backgroundColor: '#FF9800', color: '#FFFFFF'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFB74D'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}>
                                    Edit Post
                                </Link>
                                <button onClick={handleDelete} className="font-bold py-2 px-4 rounded-lg transition" style={{backgroundColor: '#D32F2F', color: '#FFFFFF'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F44336'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D32F2F'}>
                                    Delete Post
                                </button>
                            </div>
                        </div>

                        <div className="rounded-xl shadow-lg overflow-hidden" style={{backgroundColor: '#1E1E1E'}}>
                            {post.imageUrls && post.imageUrls.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-6">
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
                                <h1 className="text-3xl md:text-4xl font-extrabold mb-4 break-words" style={{color: '#FFFFFF'}}>{post.title}</h1>
                                <div className="flex items-center text-sm mb-6" style={{color: '#B0B0B0'}}>
                                    <span>By {post.author?.username || 'Unknown Author'}</span>
                                    <span className="mx-2">&bull;</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                {/* Yeh 'prose' class ab saari styling karegi */}
                                <div className="prose lg:prose-xl max-w-full text-content break-words ProseMirror"
                                     dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10" style={{color: '#B0B0B0'}}>Post nahi mila.</div>
                )}
            </div>
        </RoleProtectedRoute>
    );
};

export default ViewPostPage;