'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface Subcategory {
    _id: string;
    name: string;
    slug?: string;
}

const CategorySubcategoriesPage = () => {
    const params = useParams();
    const categoryParam = (params?.category as string) || '';

    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [newSubcatName, setNewSubcatName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const getAuthHeaders = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('blog_token') : null;
        if (!token) throw new Error('Aap logged-in nahi hain. Please login karein.');
        return { 'x-auth-token': token } as Record<string, string>;
    };

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!categoryParam) return;
            setIsLoading(true);
            setError('');
            try {
                const headers = getAuthHeaders();
                // Category detail + subcategories
                const response = await axios.get(`${backendUrl}/api/categories/${encodeURIComponent(categoryParam)}` , { headers });
                const cat = response.data?.category;
                const subs = response.data?.subcategories ?? [];
                if (!cat) throw new Error('Category nahi mili');
                setCategoryName(cat.name);
                setSubcategories(Array.isArray(subs) ? subs : []);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Subcategories load karne mein problem aayi.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubcategories();
    }, [categoryParam, backendUrl]);

    const createSubcategory = async () => {
        if (!newSubcatName.trim()) return;
        setCreating(true);
        setError('');
        setSuccess('');
        try {
            const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
            const body = { name: newSubcatName.trim() };
            const response = await axios.post(`${backendUrl}/api/categories/${encodeURIComponent(categoryParam)}/subcategories`, body, { headers });
            const created: Subcategory | undefined = response.data?.subcategory;
            if (created) {
                setSubcategories((prev) => [created, ...prev]);
                setNewSubcatName('');
                setSuccess('Subcategory create ho gayi.');
            } else {
                throw new Error('Subcategory create response format galat hai');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Subcategory create karne mein problem aayi.');
        } finally {
            setCreating(false);
        }
    };

    const renameSubcategory = async (sub: Subcategory) => {
        const newName = window.prompt(`Rename subcategory "${sub.name}" to:`, sub.name);
        if (!newName || newName.trim() === '' || newName.trim() === sub.name) return;
        try {
            const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
            const body = { name: newName.trim() };
            const res = await axios.put(`${backendUrl}/api/categories/${encodeURIComponent(categoryParam)}/subcategories/${encodeURIComponent(sub.slug || sub._id)}`, body, { headers });
            const updated: Subcategory | undefined = res.data?.subcategory;
            if (updated) {
                setSubcategories(prev => prev.map(s => (s._id === sub._id ? { ...s, name: updated.name, slug: updated.slug } : s)));
                setSuccess('Subcategory rename ho gayi.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Rename karne mein problem aayi.');
        }
    };

    return (
        <RoleProtectedRoute requiredRole="admin">
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">{categoryName || 'Category'} - Subcategories</h1>
                    <div className="flex items-center space-x-3">
                        <Link href="/admin/posts" className="text-indigo-600 hover:underline">&larr; Back to Categories</Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
                        <input
                            type="text"
                            value={newSubcatName}
                            onChange={(e) => setNewSubcatName(e.target.value)}
                            placeholder="New subcategory name"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            onClick={createSubcategory}
                            disabled={creating || !newSubcatName.trim()}
                            className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-60"
                        >
                            {creating ? 'Creating...' : '+ Create Subcategory'}
                        </button>
                    </div>
                    {error && <p className="text-red-600 mt-3">{error}</p>}
                    {success && <p className="text-green-600 mt-3">{success}</p>}
                </div>

                <div className="mt-8">
                    {isLoading ? (
                        <p className="text-center py-10">Subcategories load ho rahi hain...</p>
                    ) : subcategories.length === 0 ? (
                        <p className="text-center py-10 text-gray-600">Abhi koi subcategory nahi bani.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subcategories.map((sub) => {
                                const subSlug = sub.slug ?? sub._id;
                                return (
                                    <div key={sub._id} className="block border rounded-lg p-4 hover:shadow-md transition bg-white">
                                        <div className="flex items-center justify-between">
                                            <Link href={`/admin/posts/${encodeURIComponent(categoryParam)}/${encodeURIComponent(subSlug)}`} className="text-lg font-semibold text-gray-800 hover:underline">
                                                {sub.name}
                                            </Link>
                                            <button onClick={() => renameSubcategory(sub)} className="px-3 py-1 text-sm font-medium rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50">Rename</button>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Is subcategory ke posts dekhein</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </RoleProtectedRoute>
    );
};

export default CategorySubcategoriesPage;


