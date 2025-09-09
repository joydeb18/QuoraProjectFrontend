'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useState, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreatePostPage = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    // Hum wapas simple description use kar rahe hain
    const [description, setDescription] = useState('');
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
            reader.onloadend = () => { setImagePreview(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!title || !description) {
            setError("Title aur Description, dono zaroori hain.");
            return;
        }
        
        setIsLoading(true);
        setMessage('');
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', description); // Backend 'content' expect karta hai
        if (image) { formData.append('image', image); }

        try {
            const token = localStorage.getItem('blog_token');
            if (!token) throw new Error("Aap logged-in nahi hain.");
            const headers = { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' };
            await axios.post('http://localhost:5000/api/posts', formData, { headers });
            
            setMessage("Post successfully ban gaya! Redirecting...");
            setTimeout(() => { router.push('/admin/posts'); }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.message || "Post banane mein problem aayi.");
            setIsLoading(false);
        }
    };

    return (
      <RoleProtectedRoute requiredRole="admin">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800">Create a New Post</h1>
            <Link href="/admin/posts" className="text-indigo-600 hover:underline">&larr; Back to All Posts</Link>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-lg shadow-md space-y-6">
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-700">Post Title <span className="text-red-500">*</span></label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Aapke post ka title" required />
            </div>

            {/* === YAHAN HUMNE WAPAS SIMPLE TEXTAREA LAGA DIYA HAI === */}
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">Post Description <span className="text-red-500">*</span></label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={15}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Aapke post ka poora content yahan likhein..."
                required
              />
            </div>

            {/* ... (Image upload aur baaki form waisa hi rahega) ... */}
            <div>
              <label htmlFor="image" className="block text-lg font-medium text-gray-700">Featured Image (Optional)</label>
              <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                 <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"><input id="image-upload" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" /></label>
                        <p className="pl-1">or drag and drop (not enabled)</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            {imagePreview && ( <div><h3 className="text-lg font-medium text-gray-700">Image Preview:</h3><div className="mt-2 border rounded-md p-2"><img src={imagePreview} alt="Selected preview" className="max-h-60 rounded-md mx-auto"/></div></div> )}
            {message && <p className="text-center text-green-600">{message}</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            <div className="text-right">
              <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400" disabled={isLoading}>{isLoading ? 'Publishing...' : 'Publish Post'}</button>
            </div>
          </form>
        </div>
      </RoleProtectedRoute>
    );
};
export default CreatePostPage;