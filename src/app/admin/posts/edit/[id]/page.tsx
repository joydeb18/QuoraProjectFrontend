'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(() => import('@/app/components/TiptapEditor'), { ssr: false });

const EditPostPage = () => {
    const router = useRouter();
    const params = useParams();
    const postId = params.id;


    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    // Page load hote hi purana post data fetch karo
    useEffect(() => {
        if (!postId) return;
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('blog_token');
                const headers = { 'x-auth-token': token };
                const response = await axios.get(`${backendUrl}/api/posts/${postId}`, { headers });
                const post = response.data.post;
                setTitle(post.title);
                setContent(post.content);
                if (post.imageUrls && Array.isArray(post.imageUrls)) {
                    setExistingImageUrls(post.imageUrls);
                    console.log("Edit Page - Fetched imageUrls from backend:", post.imageUrls);
                }
            } catch (err) {
                setError("Post data fetch karne mein problem aayi.");
            }
        };
        fetchPost();
    }, [postId, backendUrl]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newSelectedImages = Array.from(files);
            setNewImages(prevImages => [...prevImages, ...newSelectedImages]);

            const newPreviews: string[] = [];
            newSelectedImages.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);
                    if (newPreviews.length === newSelectedImages.length) {
                        setNewImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Form submit karne par
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        const formData = new FormData();
                formData.append('title', title);
        formData.append('content', content);
        newImages.forEach((file, index) => {
            formData.append(`images`, file);
        });

        try {
            const token = localStorage.getItem('blog_token');
            const headers = { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' };
            await axios.put(`${backendUrl}/api/posts/${postId}`, formData, { headers });
            
            setMessage("Post successfully update ho gaya! Redirecting...");
            setTimeout(() => { router.push(`/admin/posts/view/${postId}`); }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Post update karne mein problem aayi.");
            setIsLoading(false);
        }
    };

    return (
      <RoleProtectedRoute requiredRole="admin">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800">Edit Post</h1>
            <Link href={`/admin/posts/view/${postId}`} className="text-indigo-600 hover:underline">&larr; Back to View Post</Link>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-lg shadow-md space-y-6">
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-700">Post Title <span className="text-red-500">*</span></label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">Post Description <span className="text-red-500">*</span></label>
              {content && <TiptapEditor content={content} onChange={(newContent) => setContent(newContent)} />}
            </div>
            <div>
              <label htmlFor="newImages" className="block text-lg font-medium text-gray-700">Add New Images (Optional)</label>
              <input type="file" id="newImages" onChange={handleImageChange} accept="image/*" multiple className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
            </div>
            {existingImageUrls.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-gray-700">Existing Images:</h3>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {existingImageUrls.map((url, index) => {
                            
                            return (
                                <div key={index} className="border rounded-md p-2">
                                    <img src={`${backendUrl}/${url}`} alt={`Existing image ${index + 1}`} className="max-h-40 w-full object-contain rounded-md"/>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {newImagePreviews.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-gray-700">New Image Previews:</h3>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newImagePreviews.map((preview, index) => (
                            <div key={index} className="border rounded-md p-2">
                                <img src={preview} alt={`New preview ${index + 1}`} className="max-h-40 w-full object-contain rounded-md"/>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {message && <p className="text-center text-green-600">{message}</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            <div className="text-right">
              <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Post'}</button>
            </div>
          </form>
        </div>
      </RoleProtectedRoute>
    );
  };
  export default EditPostPage;