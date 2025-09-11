'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Post {
    _id: string;
    title: string;
    author?: { username?: string };
    createdAt: string;
}

const SubcategoryPostsPage = () => {
    const params = useParams();
    const router = useRouter();
    const categoryParam = (params?.category as string) || '';
    const subcategoryParam = (params?.subcategory as string) || '';

    // States
    const [posts, setPosts] = useState<Post[]>([]);
    const [subcategoryName, setSubcategoryName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Subcategory Rename ke States ---
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);


    const getAuthHeaders = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('blog_token') : null;
        if (!token) throw new Error('Aap logged-in nahi hain. Please login karein.');
        return { 'x-auth-token': token };
    };

    useEffect(() => {
        const fetchPostsBySubcategory = async () => {
            if (!categoryParam || !subcategoryParam) return;
            setIsLoading(true);
            try {
                const headers = getAuthHeaders();
                // API se post ke saath subcategory ka naam bhi le rahe hain
                const response = await axios.get(`http://localhost:8080/api/posts?category=${encodeURIComponent(categoryParam)}&subcategory=${encodeURIComponent(subcategoryParam)}`, { headers });
                
                setPosts(response.data?.posts || []);
                // NOTE: Assume kar rahe hain ki API response mein `subcategory.name` aa raha hai.
                const subcatName = response.data?.subcategory?.name || 'Subcategory Posts';
                setSubcategoryName(subcatName);
                setEditedName(subcatName);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Posts load karne mein problem aayi.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPostsBySubcategory();
    }, [categoryParam, subcategoryParam]);
    
    // --- Subcategory ko Update karne ka Function ---
    const handleUpdateSubcategory = async () => {
        if (!editedName.trim() || editedName.trim() === subcategoryName) {
            setIsEditing(false);
            return;
        }

        setIsUpdating(true);
        setError('');
        try {
            const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
            const response = await axios.put(`http://localhost:8080/api/categories/${encodeURIComponent(categoryParam)}/subcategories/${encodeURIComponent(subcategoryParam)}`, { name: editedName.trim() }, { headers });
            
            const updated = response.data?.subcategory;
            if (updated) {
                setSubcategoryName(updated.name);
                setEditedName(updated.name);
                setIsEditing(false);
                // Agar slug change hua hai to URL update karein
                if (updated.slug && updated.slug !== subcategoryParam) {
                    router.replace(`/admin/posts/${encodeURIComponent(categoryParam)}/${encodeURIComponent(updated.slug)}`);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Subcategory update karne mein problem aayi.');
            // Revert changes on error
            setEditedName(subcategoryName);
        } finally {
            setIsUpdating(false);
        }
    };


    return (
        <RoleProtectedRoute requiredRole="admin">
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    {/* --- Subcategory Heading Rename Section --- */}
                    <div className="flex items-center gap-4">
                        {isEditing ? (
                             <>
                                <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="text-3xl font-extrabold p-1 border-b-2" autoFocus />
                                <button onClick={handleUpdateSubcategory} disabled={isUpdating} className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50">{isUpdating ? 'Saving...' : 'Save'}</button>
                                <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Cancel</button>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl font-extrabold text-gray-800">{subcategoryName}</h1>
                                {!isLoading && <button onClick={() => setIsEditing(true)} className="text-sm text-indigo-600 hover:underline">Rename</button>}
                            </>
                        )}
                    </div>
                    {/* ... other links */}
                </div>
                
                {/* ... (Posts ki table waise hi hai) ... */}
            </div>
        </RoleProtectedRoute>
    );
};

export default SubcategoryPostsPage;