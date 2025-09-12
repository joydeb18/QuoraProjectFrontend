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
              <h1 className="text-3xl font-extrabold" style={{color: '#FF9800'}}>Admin Control Panel</h1>
              <p className="text-lg" style={{color: '#B0B0B0'}}>Welcome, {username || 'Master'}!</p>
            </div>
            {/* "All Posts" button abhi bhi rahega, lekin iska page abhi simple hai */}
            <Link href="/admin/posts" className="font-bold py-2 px-4 rounded-lg transition" style={{backgroundColor: '#FF9800', color: '#FFFFFF'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFB74D'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}>
                All Posts
            </Link>
          </div>
          
          <div className="mt-8 border rounded-lg p-4 shadow-md" style={{backgroundColor: '#1E1E1E', borderColor: '#FF9800'}}>
            <h2 className="text-2xl font-bold mb-4" style={{color: '#FFFFFF'}}>User Management</h2>
            {isLoading ? ( <p style={{color: '#FFFFFF'}}>Loading user list...</p> ) : 
             error ? ( <p className="text-red-500 text-center py-4">{error}</p> ) : 
            (
              <div className="overflow-x-auto">
                <table className="min-w-full border" style={{backgroundColor: '#2E2E2E'}}>
                    <thead style={{backgroundColor: '#FF9800'}}><tr><th className="py-2 px-4 border" style={{color: '#FFFFFF'}}>Username</th><th className="py-2 px-4 border" style={{color: '#FFFFFF'}}>Email</th><th className="py-2 px-4 border" style={{color: '#FFFFFF'}}>Role</th><th className="py-2 px-4 border" style={{color: '#FFFFFF'}}>Status</th><th className="py-2 px-4 border" style={{color: '#FFFFFF'}}>Actions</th></tr></thead>
                    <tbody>
                        {users.map((user) => (
                        <tr key={user._id} className="text-center hover:opacity-80" style={{backgroundColor: '#2E2E2E'}}>
                            <td className="py-2 px-4 border" style={{color: '#FFFFFF'}}>{user.username}</td><td className="py-2 px-4 border" style={{color: '#FFFFFF'}}>{user.email}</td><td className="py-2 px-4 border" style={{color: '#FFFFFF'}}>{user.role}</td>
                            <td className="py-2 px-4 border"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{color: '#FFFFFF'}}>{user.status}</span></td>
                            <td className="py-2 px-4 border"><select onChange={(e) => {handleAction(user._id, e.target.value); e.target.value = ""}} className="border rounded p-1" style={{backgroundColor: '#2E2E2E', color: '#FFFFFF', borderColor: '#FF9800'}}><option value="">Select Action</option><option value="delete">Delete</option></select></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Deleted Users Table */}
          {!isLoading && deletedUsers.length > 0 && (
            <div className="mt-8 border rounded-lg p-4 shadow-md" style={{backgroundColor: '#1E1E1E', borderColor: '#FF9800'}}>
              <h2 className="text-2xl font-bold mb-4" style={{color: '#FFFFFF'}}>Deleted Users</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border" style={{backgroundColor: '#2E2E2E'}}>
                    <thead style={{backgroundColor: '#FF9800'}}><tr><th className="py-2 px-4 border" style={{color: '#FFFFFF'}}>Username</th><th className="py-2 px-4 border" style={{color: '#FFFFFF'}}>Email</th></tr></thead>
                    <tbody>
                        {deletedUsers.map((user) => (
                        <tr key={user._id} className="text-center" style={{backgroundColor: '#2E2E2E'}}>
                            <td className="py-2 px-4 border" style={{color: '#FFFFFF'}}>{user.username}</td><td className="py-2 px-4 border" style={{color: '#FFFFFF'}}>{user.email}</td>
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