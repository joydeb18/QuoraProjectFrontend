'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface Post {
    _id: string;
    title: string;
    author?: { username?: string };
    createdAt: string;
}

const SubcategoryPostsPage = () => {
    const params = useParams();
    const categoryParam = (params?.category as string) || '';
    const subcategoryParam = (params?.subcategory as string) || '';

    const [posts, setPosts] = useState<Post[]>([]);
    const [heading, setHeading] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const getAuthHeaders = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('blog_token') : null;
        if (!token) throw new Error('Aap logged-in nahi hain. Please login karein.');
        return { 'x-auth-token': token } as Record<string, string>;
    };

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        const fetchPostsBySubcategory = async () => {
            if (!categoryParam || !subcategoryParam) return;
            setIsLoading(true);
            setError('');
            try {
                const headers = getAuthHeaders();
                const response = await axios.get(`${backendUrl}/api/posts?category=${encodeURIComponent(categoryParam)}&subcategory=${encodeURIComponent(subcategoryParam)}`, { headers });
                const list = response.data?.posts || [];
                setPosts(Array.isArray(list) ? list : []);
                setHeading(response.data?.label || 'Posts');
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Posts load karne mein problem aayi.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPostsBySubcategory();
    }, [categoryParam, subcategoryParam, backendUrl]);

    return (
        <RoleProtectedRoute requiredRole="admin">
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">{heading || 'Subcategory Posts'}</h1>
                    <div className="flex items-center space-x-3">
                        <Link href={`/admin/posts/${encodeURIComponent(categoryParam)}`} className="text-indigo-600 hover:underline">&larr; Back to Subcategories</Link>
                        <Link href={`/admin/posts/new?category=${encodeURIComponent(categoryParam)}&subcategory=${encodeURIComponent(subcategoryParam)}`} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md">+ Create Post</Link>
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-lg bg-white shadow-md">
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
                                                <Link href={`/admin/posts/view/${post._id}`} className="text-indigo-600 hover:underline font-semibold">View / Edit</Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-10 text-gray-500">Is subcategory mein koi post nahi mila.</td>
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

export default SubcategoryPostsPage;


