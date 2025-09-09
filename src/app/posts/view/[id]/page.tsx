'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute"; // Role-based access
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

// Post interface
interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
  imageUrl?: string;
}

const ViewPostPage = () => {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('blog_token');
        if (!token) throw new Error("Aap logged-in nahi hain.");
        const headers = { 'x-auth-token': token };
        const response = await axios.get(`${backendUrl}/api/posts/${postId}`, { headers });
        setPost(response.data.post);
      } catch (err: any) {
        setError(err.response?.data?.message || "Post ko fetch karne mein problem aayi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (isLoading) return <div className="text-center py-10">Loading post...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <RoleProtectedRoute requiredRole="user"> {/* Role check for user */}
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-indigo-600 hover:underline mb-6 inline-block">
          &larr; Back to All Posts
        </Link>
        
        {post && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {post.imageUrl && (
              <div className="bg-gray-100 p-4">
                <img src={`${backendUrl}/${post.imageUrl}`} alt={post.title} className="w-full max-h-[500px] object-contain mx-auto rounded-md" />
              </div>
            )}
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <span>By {post.author?.username || 'Unknown'}</span>
                <span className="mx-2">&bull;</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="prose lg:prose-xl max-w-full text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
};

export default ViewPostPage;