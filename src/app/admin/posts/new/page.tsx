'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState, ChangeEvent, FormEvent, Suspense } from "react";
import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(() => import('@/app/components/TiptapEditor'), { ssr: false });
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const PostForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Array<{ _id: string; name: string; slug?: string }>>([]);
    const [subcategories, setSubcategories] = useState<Array<{ _id: string; name: string; slug?: string }>>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

    const getAuthHeaders = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('blog_token') : null;
        if (!token) throw new Error('Aap logged-in nahi hain.');
        return { 'x-auth-token': token } as Record<string, string>;
    };

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        const catParam = searchParams.get('category') || '';
        const subcatParam = searchParams.get('subcategory') || '';
        if (catParam) setSelectedCategory(catParam);
        if (subcatParam) setSelectedSubcategory(subcatParam);
    }, [searchParams]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const headers = getAuthHeaders();
                const response = await axios.get(`${backendUrl}/api/categories`, { headers });
                const list = response.data?.categories || [];
                setCategories(Array.isArray(list) ? list : []);
            } catch (err: any) {
                // silent fail in form; show inline error on submit if needed
            }
        };
        fetchCategories();
    }, [backendUrl]);

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!selectedCategory) { setSubcategories([]); return; }
            try {
                const headers = getAuthHeaders();
                const response = await axios.get(`${backendUrl}/api/categories/${encodeURIComponent(selectedCategory)}`, { headers });
                const subs = response.data?.subcategories || [];
                setSubcategories(Array.isArray(subs) ? subs : []);
            } catch (err: any) {
                setSubcategories([]);
            }
        };
        fetchSubcategories();
    }, [selectedCategory, backendUrl]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files);
            setImages(prevImages => [...prevImages, ...newImages]);

            const newPreviews: string[] = [];
            newImages.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);
                    if (newPreviews.length === newImages.length) {
                        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!title || !content) {
            setError("Title aur Content, dono zaroori hain.");
            return;
        }
        
        setIsLoading(true);
        setMessage('');
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (selectedCategory) formData.append('category', selectedCategory);
        if (selectedSubcategory) formData.append('subcategory', selectedSubcategory);
        images.forEach((file, index) => {
            formData.append(`images`, file);
        });

        try {
            const token = localStorage.getItem('blog_token');
            if (!token) throw new Error("Aap logged-in nahi hain.");
            
            const headers = { 
                'x-auth-token': token,
                'Content-Type': 'multipart/form-data'
            };

            await axios.post(`${backendUrl}/api/posts`, formData, { headers });
            
            setMessage("Post successfully ban gaya! Redirect kar rahe hain...");
            setTimeout(() => {
                router.push('/admin/posts');
            }, 2000);

        } catch (err: any) {
            console.error("Post create karne mein error:", err);
            setError(err.response?.data?.message || "Post banane mein problem aayi.");
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800">Create a New Post</h1>
                <Link href="/admin/posts" className="text-indigo-600 hover:underline">&larr; Back to All Posts</Link>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(''); }}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c.slug || c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subcategory" className="block text-lg font-medium text-gray-700">Subcategory</label>
                        <select
                            id="subcategory"
                            value={selectedSubcategory}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                            disabled={!selectedCategory}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                        >
                            <option value="">Select subcategory</option>
                            {subcategories.map((s) => (
                                <option key={s._id} value={s.slug || s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="title" className="block text-lg font-medium text-gray-700">Post Title <span className="text-red-500">*</span></label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                </div>

                <div>
                    <label htmlFor="content" className="block text-lg font-medium text-gray-700">Post Content <span className="text-red-500">*</span></label>
                    <TiptapEditor content={content} onChange={(newContent) => setContent(newContent)} />
                </div>

                {/* === 2. IMAGE UPLOAD BUTTON THEEK KAR DIYA GAYA HAI === */}
                <div>
                    <label htmlFor="images" className="block text-lg font-medium text-gray-700">Featured Images (Optional)</label>
                    <input 
                        type="file" 
                        id="images" 
                        onChange={handleImageChange} 
                        accept="image/png, image/jpeg, image/gif" 
                        multiple
                        className="mt-2 block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100"
                    />
                </div>

                {imagePreviews.length > 0 && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Image Previews:</h3>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="border rounded-md p-2">
                                    <img src={preview} alt={`Selected preview ${index + 1}`} className="max-h-40 w-full object-contain rounded-md"/>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {message && <p className="text-center text-green-600 font-semibold">{message}</p>}
                {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

                <div className="text-right">
                    <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400" disabled={isLoading}>
                        {isLoading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const CreatePostPage = () => {
    return (
        <RoleProtectedRoute requiredRole="admin">
            <Suspense fallback={<div>Loading...</div>}>
                <PostForm />
            </Suspense>
        </RoleProtectedRoute>
    );
};

export default CreatePostPage;