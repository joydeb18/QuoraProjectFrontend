'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface Subcategory {
  _id: string;
  name: string;
  slug?: string;
}

export default function UserSubcategoriesPage() {
  const params = useParams();
  const categoryParam = (params?.category as string) || '';

  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryParam) return;
      setIsLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('blog_token');
        if (!token) throw new Error('Please login.');
        const headers = { 'x-auth-token': token } as Record<string, string>;
        const res = await axios.get(`${backendUrl}/api/categories/${encodeURIComponent(categoryParam)}`, { headers });
        const cat = res.data?.category;
        const subs = res.data?.subcategories ?? [];
        if (cat?.name) setCategoryName(cat.name);
        setSubcategories(Array.isArray(subs) ? subs : []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Subcategories load karne mein problem aayi.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubcategories();
  }, [categoryParam, backendUrl]);

  return (
    <RoleProtectedRoute requiredRole="user">
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">{categoryName || 'Category'}</h1>
        {isLoading ? (
          <p className="text-center">Loading subcategories...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : subcategories.length === 0 ? (
          <p className="text-center text-gray-600">Is category mein abhi koi subcategory nahi hai.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subcategories.map((sub) => {
              const slug = sub.slug || sub._id;
              return (
                <Link
                  href={`/posts/${encodeURIComponent(categoryParam)}/${encodeURIComponent(slug)}`}
                  className="block relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                             bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400 group"
                >
                  <>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{sub.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">Explore posts in this subcategory &rarr;</p>
                    </div>
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
}


