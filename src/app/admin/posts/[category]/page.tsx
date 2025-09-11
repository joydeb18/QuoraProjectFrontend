'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Subcategory {
    _id: string;
    name: string;
    slug?: string;
}

const CategorySubcategoriesPage = () => {
    const params = useParams();
    const router = useRouter();
    const categoryParam = (params?.category as string) || '';

    // States
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [newSubcatName, setNewSubcatName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // --- Category Rename ke States ---
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [editedCategoryName, setEditedCategoryName] = useState('');
    const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
    
    // --- Subcategory Edit/Delete ke States ---
    const [editingSubcatId, setEditingSubcatId] = useState<string | null>(null);
    const [editedSubcatName, setEditedSubcatName] = useState('');
    const [isUpdatingSubcat, setIsUpdatingSubcat] = useState(false);


    const getAuthHeaders = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('blog_token') : null;
        if (!token) throw new Error('Aap logged-in nahi hain. Please login karein.');
        return { 'x-auth-token': token };
    };

    // Fetch data on load
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!categoryParam) return;
            setIsLoading(true);
            try {
                const headers = getAuthHeaders();
                const response = await axios.get(`http://localhost:8080/api/categories/${encodeURIComponent(categoryParam)}`, { headers });
                const cat = response.data?.category;
                if (!cat) throw new Error('Category nahi mili');
                setCategoryName(cat.name);
                setEditedCategoryName(cat.name);
                setSubcategories(response.data?.subcategories ?? []);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Data load karne mein problem aayi.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubcategories();
    }, [categoryParam]);

    // --- All Functions ---

    const handleUpdateCategory = async () => {
        setIsUpdatingCategory(true);
        setError(''); setSuccess('');
        try {
            const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
            const response = await axios.put(`http://localhost:8080/api/categories/${encodeURIComponent(categoryParam)}`, { name: editedCategoryName.trim() }, { headers });
            const updated = response.data?.category;
            if (updated) {
                setCategoryName(updated.name);
                setEditedCategoryName(updated.name);
                setIsEditingCategory(false);
                setSuccess('Category ka naam update ho gaya.');
                if (updated.slug && updated.slug !== categoryParam) {
                    router.replace(`/admin/posts/${encodeURIComponent(updated.slug)}`);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Category update karne mein problem aayi.');
        } finally {
            setIsUpdatingCategory(false);
        }
    };
    
    const createSubcategory = async () => {
        // ... (Yeh function same hai, koi change nahi)
        if (!newSubcatName.trim()) return;
        setCreating(true);
        setError(''); setSuccess('');
        try {
            const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
            const response = await axios.post(`http://localhost:8080/api/categories/${encodeURIComponent(categoryParam)}/subcategories`, { name: newSubcatName.trim() }, { headers });
            if (response.data?.subcategory) {
                setSubcategories((prev) => [response.data.subcategory, ...prev]);
                setNewSubcatName('');
                setSuccess('Subcategory create ho gayi.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Subcategory create karne mein problem aayi.');
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateSubcategory = async (subcatId: string) => {
        const originalSubcategory = subcategories.find(s => s._id === subcatId);
        if (!originalSubcategory || editedSubcatName.trim() === originalSubcategory.name) {
            setEditingSubcatId(null);
            return;
        }

        setIsUpdatingSubcat(true);
        setError(''); setSuccess('');
        try {
            const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
            const subSlug = originalSubcategory.slug || originalSubcategory._id;
            const response = await axios.put(`http://localhost:8080/api/categories/${encodeURIComponent(categoryParam)}/subcategories/${encodeURIComponent(subSlug)}`, { name: editedSubcatName.trim() }, { headers });

            if (response.data?.subcategory) {
                setSubcategories(subcategories.map(sub => sub._id === subcatId ? response.data.subcategory : sub));
                setEditingSubcatId(null);
                setSuccess('Subcategory update ho gayi.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Subcategory update karne mein problem aayi.');
        } finally {
            setIsUpdatingSubcat(false);
        }
    };

    const handleDeleteSubcategory = async (subcat: Subcategory) => {
        if (!window.confirm(`Kya aap "${subcat.name}" subcategory ko delete karna chahte hain?`)) return;
        
        setError(''); setSuccess('');
        try {
            const headers = getAuthHeaders();
            const subSlug = sub.slug || sub._id;
            await axios.delete(`http://localhost:8080/api/categories/${encodeURIComponent(categoryParam)}/subcategories/${encodeURIComponent(subSlug)}`, { headers });
            setSubcategories(subcategories.filter(s => s._id !== subcat._id));
            setSuccess('Subcategory delete ho gayi.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Subcategory delete karne mein problem aayi.');
        }
    };

    return (
        <RoleProtectedRoute requiredRole="admin">
            <div className="p-4 md:p-8">
                {/* --- Main Category Rename Section --- */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                         {isEditingCategory ? (
                            <>
                                <input type="text" value={editedCategoryName} onChange={(e) => setEditedCategoryName(e.target.value)} className="text-3xl font-extrabold p-1 border-b-2" autoFocus />
                                <button onClick={handleUpdateCategory} disabled={isUpdatingCategory} className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50">{isUpdatingCategory ? 'Saving...' : 'Save'}</button>
                                <button onClick={() => setIsEditingCategory(false)} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Cancel</button>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl font-extrabold text-gray-800">{categoryName || 'Category'} - Subcategories</h1>
                                <button onClick={() => { setIsEditingCategory(true); setEditedCategoryName(categoryName); }} className="text-sm text-indigo-600 hover:underline">Rename</button>
                            </>
                        )}
                    </div>
                    {/* ... other links */}
                </div>
                
                {/* ... (Create Subcategory form waisa hi hai) ... */}

                {/* --- Subcategories List with Edit/Delete --- */}
                <div className="mt-8">
                    {isLoading ? <p>Loading...</p> : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subcategories.map((sub) => (
                                <div key={sub._id} className="border rounded-lg p-4 bg-white transition shadow-sm">
                                    {editingSubcatId === sub._id ? (
                                        // --- Edit Mode ---
                                        <div>
                                            <input type="text" value={editedSubcatName} onChange={(e) => setEditedSubcatName(e.target.value)} className="w-full p-2 border rounded" autoFocus />
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => handleUpdateSubcategory(sub._id)} disabled={isUpdatingSubcat} className="bg-green-600 text-white text-sm px-3 py-1 rounded disabled:opacity-50">{isUpdatingSubcat ? '...' : 'Save'}</button>
                                                <button onClick={() => setEditingSubcatId(null)} className="bg-gray-500 text-white text-sm px-3 py-1 rounded">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        // --- View Mode ---
                                        <div>
                                            <Link href={`/admin/posts/${encodeURIComponent(categoryParam)}/${encodeURIComponent(sub.slug || sub._id)}`} className="block">
                                                <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600">{sub.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">Posts dekhein</p>
                                            </Link>
                                            <div className="flex gap-3 mt-3 pt-3 border-t">
                                                <button onClick={() => { setEditingSubcatId(sub._id); setEditedSubcatName(sub.name); }} className="text-sm font-medium text-blue-600 hover:underline">Rename</button>
                                                <button onClick={() => handleDeleteSubcategory(sub)} className="text-sm font-medium text-red-600 hover:underline">Delete</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </RoleProtectedRoute>
    );
};

export default CategorySubcategoriesPage;