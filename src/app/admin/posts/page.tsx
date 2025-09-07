'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import Link from "next/link";

// Abhi ke liye yeh ek simple placeholder page hai.
const AllPostsPage = () => {
    return (
      <RoleProtectedRoute requiredRole="admin">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800">Post Management</h1>
            <Link href="/admin/dashboard" className="text-indigo-600 hover:underline">
              &larr; Back to User Dashboard
            </Link>
          </div>
          
          <div className="mt-8 border rounded-lg p-8 bg-white shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Blog Posts</h2>
            <p className="text-gray-600">
              Yeh page abhi ban raha hai. Jald hi yahan par saare blog posts ki list dikhegi.
            </p>
          </div>
        </div>
      </RoleProtectedRoute>
    );
  };
  
  export default AllPostsPage;