'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useState, DragEvent, ChangeEvent } from "react"; // Types ko import kiya
import axios from "axios";
import { useRouter } from "next/navigation";

const CreatePostPage = () => {
    const router = useRouter();
    // Form ke data ke liye states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false); // Drag event ko track karne ke liye

    // Messages aur loading ke liye states
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // File ko handle karne wala function
    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select an image file (png, jpg, gif).");
        }
    };

    // "Upload a file" par click karne par
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    // Drag & Drop Functions
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    // Form submit karne par
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
        formData.append('content', description);
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

            await axios.post('http://localhost:5000/api/posts', formData, { headers });
            
            setMessage("Post successfully ban gaya! Aapko posts waale page par redirect kiya jaa raha hai...");
            setTimeout(() => {
                router.push('/admin/posts');
            }, 2000);

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
            <Link href="/admin/posts" className="text-indigo-600 hover:underline">
              &larr; Back to All Posts
            </Link>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-lg shadow-md space-y-6">
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-700">Post Title <span className="text-red-500">*</span></label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Aapke post ka title" required />
            </div>

            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">Post Description <span className="text-red-500">*</span></label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={10} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Aapke post ka poora content yahan likhein..." required />
            </div>

            <div>
              <label htmlFor="image" className="block text-lg font-medium text-gray-700">Featured Image (Optional)</label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
              >
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
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