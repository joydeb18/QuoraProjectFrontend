'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
    _id: string;
    name: string;
    slug?: string;
}

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const getAuthHeaders = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('blog_token') : null;
        if (!token) throw new Error('Aap logged-in nahi hain. Please login karein.');
        return { 'x-auth-token': token } as Record<string, string>;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            setError('');
            try {
                const headers = getAuthHeaders();
                const response = await axios.get('http://localhost:8080/api/categories', { headers });
                const list = response.data?.categories || [];
                if (!Array.isArray(list)) throw new Error('Categories response format galat hai');
                setCategories(list);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Categories load karne mein problem aayi.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const createCategory = async () => {
        if (!newCategoryName.trim()) return;
        setCreating(true);
        setError('');
        setSuccess('');
        try {
            const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
            const body = { name: newCategoryName.trim() };
            const response = await axios.post('http://localhost:8080/api/categories', body, { headers });
            const created: Category | undefined = response.data?.category;
            if (created) {
                setCategories((prev) => [created, ...prev]);
                setNewCategoryName('');
                setSuccess('Category create ho gayi.');
            } else {
                throw new Error('Category create response format galat hai');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Category create karne mein problem aayi.');
        } finally {
            setCreating(false);
        }
    };

    return (
        <RoleProtectedRoute requiredRole="admin">
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">Categories</h1>
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/dashboard" className="text-indigo-600 hover:underline">
                            &larr; Back to Dashboard
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New category name"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            onClick={createCategory}
                            disabled={creating || !newCategoryName.trim()}
                            className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-60"
                        >
                            {creating ? 'Creating...' : '+ Create Category'}
                        </button>
                        <Link href="/admin/posts/new" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md">
                            + Create Post
                        </Link>
                    </div>
                    {error && <p className="text-red-600 mt-3">{error}</p>}
                    {success && <p className="text-green-600 mt-3">{success}</p>}
                </div>

                <div className="mt-8">
                    {isLoading ? (
                        <p className="text-center py-10">Categories load ho rahi hain...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-center py-10 text-gray-600">Abhi koi category nahi bani.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat) => {
                                const catSlug = cat.slug || cat._id;
                                return (
                                    <Link key={cat._id} href={`/admin/posts/${encodeURIComponent(catSlug)}`} className="block border rounded-lg p-4 hover:shadow-md transition bg-white">
                                        <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">Subcategories dekhein & manage karein</p>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </RoleProtectedRoute>
    );
};

export default CategoriesPage;