'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useState } from "react";
import axios from "axios"; // axios ko import kiya
import { useRouter } from "next/navigation"; // router ko import kiya

const CreatePostPage = () => {
    const router = useRouter();
    // Form ke data ke liye states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // const [image, setImage] = useState<File | null>(null); // Image wala kaam hum baad mein karenge

    // Nayi states messages aur loading ke liye
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Form submit karne par yeh function chalega
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!title || !description) {
            setError("Title aur Description, dono zaroori hain.");
            return;
        }
        
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('blog_token');
            if (!token) {
                throw new Error("Aap logged-in nahi hain. Please login again.");
            }

            const payload = {
                title,
                content: description, // Backend mein humne isse 'content' naam diya hai
            };
            
            const headers = { 'x-auth-token': token };

            // Backend ke naye API route ko call karna
            await axios.post('http://localhost:5000/api/posts', payload, { headers });
            
            setMessage("Post successfully ban gaya! Aapko posts waale page par redirect kiya jaa raha hai...");

            // Success hone par 2 second baad 'All Posts' page par bhej do
            setTimeout(() => {
                router.push('/admin/posts');
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.message || "Post banane mein problem aayi.");
            setIsLoading(false);
        }
        // Success hone par loading state false nahi karenge, kyunki page redirect ho jayega
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
            {/* Post Title Input */}
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-700">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Aapke post ka title"
                required
              />
            </div>

            {/* Post Description Textarea */}
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">
                Post Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Aapke post ka poora content yahan likhein..."
                required
              />
            </div>
            
            {/* Messages */}
            {message && <p className="text-center text-green-600">{message}</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                disabled={isLoading}
              >
                {isLoading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </form>

        </div>
      </RoleProtectedRoute>
    );
  };
  
  export default CreatePostPage;