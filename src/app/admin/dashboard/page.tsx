'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

// Interfaces for our data types
interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'disabled';
}

const AdminDashboardPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    
    // States sirf users ke liye hain
    const [users, setUsers] = useState<User[]>([]);
    const [deletedUsers, setDeletedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
      // Backend ka URL Vercel se le rahe hain
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const userDataString = localStorage.getItem('blog_user');
        if (userDataString) {
            const user = JSON.parse(userDataString);
            setUsername(user.name);
        }

        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('blog_token');
                if (!token) throw new Error("Token nahi mila. Please login again.");
                
                const headers = { 'x-auth-token': token };
                
                // === YAHAN BADLAV KIYA GAYA HAI ===
                // Hum ab sirf users ki list fetch kar rahe hain, posts ki nahi
                const [activeUsersRes, deletedUsersRes] = await Promise.all([
                        axios.get(`${backendUrl}/api/users`, { headers }),
          axios.get(`${backendUrl}/api/users/deleted`, { headers })
           ]);
                
                setUsers(activeUsersRes.data.users);
                setDeletedUsers(deletedUsersRes.data.users);
                setError('');

            } catch (err: any) {
                console.error("Data fetch karne mein error:", err); 
                setError(err.response?.data?.message || "Users ko fetch karne mein problem aayi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // handleAction function (for users) jaisa tha waisa hi rahega
     const handleAction = async (userId: string, action: string) => {
        const token = localStorage.getItem('blog_token');
        const headers = { 'x-auth-token': token };
        const userToActOn = users.find(u => u._id === userId);
        if (action === 'delete') {
            if (window.confirm('Are you sure you want to delete this user?')) {
                try {
                     await axios.delete(`${backendUrl}/api/users/${userId}`, { headers });
                      window.location.reload(); 
                } catch (err) { alert('Failed to delete user.'); }
            }
        }
    };


    return (
      <RoleProtectedRoute requiredRole="admin">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-red-600">Admin Control Panel</h1>
              <p className="text-lg text-gray-700">Welcome, {username || 'Master'}!</p>
            </div>
            {/* "All Posts" button abhi bhi rahega, lekin iska page abhi simple hai */}
            <Link href="/admin/posts" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                All Posts
            </Link>
          </div>
          
          <div className="mt-8 border rounded-lg p-4 bg-white shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Management</h2>
            {isLoading ? ( <p>Loading user list...</p> ) : 
             error ? ( <p className="text-red-500 text-center py-4">{error}</p> ) : 
            (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-200"><tr><th className="py-2 px-4 border">Username</th><th className="py-2 px-4 border">Email</th><th className="py-2 px-4 border">Role</th><th className="py-2 px-4 border">Status</th><th className="py-2 px-4 border">Actions</th></tr></thead>
                    <tbody>
                        {users.map((user) => (
                        <tr key={user._id} className="text-center hover:bg-gray-50">
                            <td className="py-2 px-4 border">{user.username}</td><td className="py-2 px-4 border">{user.email}</td><td className="py-2 px-4 border">{user.role}</td>
                            <td className="py-2 px-4 border"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{user.status}</span></td>
                            <td className="py-2 px-4 border"><select onChange={(e) => {handleAction(user._id, e.target.value); e.target.value = ""}} className="border rounded p-1"><option value="">Select Action</option><option value="delete">Delete</option></select></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Deleted Users Table */}
          {!isLoading && deletedUsers.length > 0 && (
            <div className="mt-8 border rounded-lg p-4 bg-gray-50 shadow-md">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Deleted Users</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-100"><tr><th className="py-2 px-4 border">Username</th><th className="py-2 px-4 border">Email</th></tr></thead>
                    <tbody>
                        {deletedUsers.map((user) => (
                        <tr key={user._id} className="text-center">
                            <td className="py-2 px-4 border">{user.username}</td><td className="py-2 px-4 border">{user.email}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </RoleProtectedRoute>
    );
  };
  
  export default AdminDashboardPage;