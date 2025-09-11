'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

export default function UserCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('blog_token');
        if (!token) throw new Error('Please login.');
        const headers = { 'x-auth-token': token } as Record<string, string>;
        const res = await axios.get(`${backendUrl}/api/categories`, { headers });
        const list = res.data?.categories || [];
        setCategories(Array.isArray(list) ? list : []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Categories load karne mein problem aayi.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  return (
    <RoleProtectedRoute requiredRole="user">
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Browse by Category</h1>
        {isLoading ? (
          <p className="text-center">Loading categories...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-600">Abhi koi category nahi bani.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const slug = cat.slug || cat._id;
              return (
                <Link
                  key={cat._id}
                  href={`/posts/${encodeURIComponent(slug)}`}
                  className="block border rounded-lg p-4 bg-white hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Subcategories dekhein</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
}


