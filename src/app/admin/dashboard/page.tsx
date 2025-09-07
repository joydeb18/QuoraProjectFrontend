'use client';

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios"; // axios ko import kiya

// User ke data type ke liye ek interface banaya
interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const AdminDashboardPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    
    // Nayi states user list, loading, aur error ke liye
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Page load hote hi user ka naam set karna
        const userDataString = localStorage.getItem('blog_user');
        if (userDataString) {
            const user = JSON.parse(userDataString);
            setUsername(user.name);
        }

        // Saare users ki list fetch karne ke liye function
        const fetchUsers = async () => {
            try {
                // Browser ki memory se token nikalo
                const token = localStorage.getItem('blog_token');
                if (!token) {
                    setError("Token nahi mila. Please login again.");
                    setIsLoading(false);
                    return;
                }

                // Backend ke naye API route ko call karo
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: {
                        // Request ke saath token (ticket) bhejna zaroori hai
                        'x-auth-token': token
                    }
                });
                
                // Response se users ki list nikaal kar state mein daal do
                setUsers(response.data.users);

            } catch (err: any) {
                setError(err.response?.data?.message || "Users ko fetch karne mein problem aayi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers(); // Function ko call kiya
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('blog_token');
        localStorage.removeItem('blog_user');
        router.push('/login');
    };

    return (
      <RoleProtectedRoute requiredRole="admin">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-red-600">Admin Control Panel</h1>
              <p className="text-lg text-gray-700">Welcome, {username || 'Master'}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Registered Users</h2>
            
            {/* Loading, Error, aur Table ka logic */}
            {isLoading ? (
              <p>Loading user list...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-4 border">Username</th>
                      <th className="py-2 px-4 border">Email</th>
                      <th className="py-2 px-4 border">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* users array par loop karke har user ke liye ek table row banana */}
                    {users.map((user) => (
                      <tr key={user._id} className="text-center">
                        <td className="py-2 px-4 border">{user.username}</td>
                        <td className="py-2 px-4 border">{user.email}</td>
                        <td className="py-2 px-4 border">{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </RoleProtectedRoute>
    );
  };
  
  export default AdminDashboardPage;