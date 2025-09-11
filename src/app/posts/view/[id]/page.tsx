'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import RoleProtectedRoute from '@/app/components/RoleProtectedRoute';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  imageUrl?: string;
}

const ViewPostPage = () => {
  const params = useParams();
  const postId = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      setIsLoading(true);
      setError('');

      try {
        const headers = {
          'x-auth-token': localStorage.getItem('blog_token') || ''
        };
        const res = await axios.get(`${backendUrl}/api/posts/${postId}`, { headers });
        setPost(res.data.post);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Post load karne mein problem aayi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, backendUrl]);

  return (
    <RoleProtectedRoute requiredRole="user">
      <div className="p-4 md:p-8">
        {isLoading ? (
          <p className="text-center">Loading post...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : post ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            {post.imageUrl && <img src={`${backendUrl}/${post.imageUrl}`} alt={post.title} className="w-full h-96 object-contain mb-6 rounded"/>}
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{post.title}</h1>
            <p className="text-lg text-gray-600 mb-4">By {post.author.username}</p>
            <div className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ) : (
          <p className="text-center text-gray-600">Post not found.</p>
        )}
      </div>
    </RoleProtectedRoute>
  );
};

export default ViewPostPage;