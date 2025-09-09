'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreatePostPage = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
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
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('blog_token');
            if (!token) throw new Error("Aap logged-in nahi hain.");
            
            const headers = { 
                'x-auth-token': token,
                'Content-Type': 'multipart/form-data'
            };

            // === 1. API URL THEEK KAR DIYA GAYA HAI ===
            await axios.post('https://quoraproject-production.up.railway.app/api/posts', formData, { headers });
            
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
        <RoleProtectedRoute requiredRole="admin">
            <div className="p-4 md:p-8 max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">Create a New Post</h1>
                    <Link href="/admin/posts" className="text-indigo-600 hover:underline">&larr; Back to All Posts</Link>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-lg shadow-md space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700">Post Title <span className="text-red-500">*</span></label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-lg font-medium text-gray-700">Post Content <span className="text-red-500">*</span></label>
                        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={15} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>

                    {/* === 2. IMAGE UPLOAD BUTTON THEEK KAR DIYA GAYA HAI === */}
                    <div>
                        <label htmlFor="image" className="block text-lg font-medium text-gray-700">Featured Image (Optional)</label>
                        <input 
                            type="file" 
                            id="image" 
                            onChange={handleImageChange} 
                            accept="image/png, image/jpeg, image/gif" 
                            className="mt-2 block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100"
                        />
                    </div>

                    {imagePreview && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-700">Image Preview:</h3>
                            <div className="mt-2 border rounded-md p-2">
                                <img src={imagePreview} alt="Selected preview" className="max-h-60 rounded-md mx-auto"/>
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
        </RoleProtectedRoute>
    );
};

export default CreatePostPage;