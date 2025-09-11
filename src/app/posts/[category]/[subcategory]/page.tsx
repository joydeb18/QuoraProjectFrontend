'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { jwtDecode } from 'jwt-decode';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  imageUrl?: string;
}

const SubcategoryPostsPage = () => {
  const params = useParams();
  const categorySlug = params?.category as string;
  const subcategorySlug = params?.subcategory as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem('blog_token');
    if (token) {
      const decodedToken: { user: { role: string } } = jwtDecode(token);
      setUserRole(decodedToken.user.role);
    }

    const fetchPosts = async () => {
      if (!categorySlug || !subcategorySlug) return;

      setIsLoading(true);
      setError('');

      try {
        const headers = {
          'x-auth-token': localStorage.getItem('blog_token') || ''
        };
        const res = await axios.get(`${backendUrl}/api/posts/${categorySlug}/${subcategorySlug}`, { headers });
        setPosts(res.data.posts || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Posts load karne mein problem aayi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [categorySlug, subcategorySlug, backendUrl]);

  return (
    <RoleProtectedRoute requiredRole="user">
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Posts</h1>
        {userRole === 'admin' && (
          <div className="mb-4">
            <Link href={`/admin/create-post?category=${categorySlug}&subcategory=${subcategorySlug}`} legacyBehavior>
              <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Post
              </a>
            </Link>
          </div>
        )}
        {isLoading ? (
          <p className="text-center">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-600">Is subcategory mein abhi koi post nahi hai.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post._id} className="border rounded-lg p-4 bg-white hover:shadow-md transition">
                {post.imageUrl && <img src={`${backendUrl}/${post.imageUrl}`} alt={post.title} className="w-full h-48 object-cover mb-4 rounded"/>}
                <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-1">By {post.author.username}</p>
                <div className="mt-2" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + '...' }} />
                <Link href={`/posts/view/${post._id}`} legacyBehavior>
                  <a className="text-blue-500 hover:underline mt-2 inline-block">View Post</a>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
};

export default SubcategoryPostsPage;