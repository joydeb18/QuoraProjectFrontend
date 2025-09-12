'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter
import RoleProtectedRoute from '@/app/components/RoleProtectedRoute';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  imageUrl?: string;
  imageUrls?: string[];
}

const ViewPostPage = () => {
  const params = useParams();
  const postId = params?.id as string;
  const router = useRouter(); // Initialize router

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
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 rounded-md transition-colors"
          style={{backgroundColor: '#FF9800', color: '#FFFFFF'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFB74D'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
        >
          &larr; Back
        </button>
        {isLoading ? (
          <p className="text-center" style={{color: '#FFFFFF'}}>Loading post...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : post ? (
          <div className="max-w-4xl mx-auto rounded-lg shadow-md p-6" style={{backgroundColor: '#1E1E1E'}}>
            {/* Handle both single image and multiple images */}
            {post.imageUrls && post.imageUrls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {post.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={`${backendUrl}/${url}`}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-md"
                  />
                ))}
              </div>
            ) : post.imageUrl ? (
              <img src={`${backendUrl}/${post.imageUrl}`} alt={post.title} className="w-full h-96 object-contain mb-6 rounded"/>
            ) : null}
            <h1 className="text-4xl font-extrabold mb-4 break-words" style={{color: '#FFFFFF'}}>{post.title}</h1>
            <p className="text-lg mb-4" style={{color: '#B0B0B0'}}>By {post.author.username}</p>
            <div className="prose lg:prose-xl max-w-none text-content break-words" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ) : (
          <p className="text-center" style={{color: '#B0B0B0'}}>Post not found.</p>
        )}
      </div>
    </RoleProtectedRoute>
  );
};

export default ViewPostPage;