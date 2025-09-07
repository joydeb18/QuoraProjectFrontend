// Step 1: Component ko 'use client' banana zaroori hai
'use client'; 

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Step 2: useState aur useEffect ko import kiya

const AdminDashboardPage = () => {
    const router = useRouter();
    // Step 3: Ek state banayi user ka naam yaad rakhne ke liye
    const [username, setUsername] = useState('');

    // Step 4: Yeh function page load hote hi sirf ek baar chalega
    useEffect(() => {
        // Browser ki memory (localStorage) se user ka object nikalo
        const userDataString = localStorage.getItem('blog_user');
        
        // Agar user data mila
        if (userDataString) {
            // String ko wapas JavaScript object mein badlo
            const user = JSON.parse(userDataString);
            // Object se naam nikaal kar 'username' state mein daal do
            setUsername(user.name);
        }
    }, []); // Khaali dependency array ka matlab hai ki yeh sirf ek baar chalega

    // Step 5: Logout function ko update kiya
    const handleLogout = () => {
        // Token ke saath-saath user ka data bhi memory se hata do
        localStorage.removeItem('blog_token');
        localStorage.removeItem('blog_user');
        // User ko wapas login page par bhej do
        router.push('/login');
    };

    return (
      <RoleProtectedRoute requiredRole="admin">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-5xl font-extrabold text-red-600 mb-4">
            Admin Control Panel
          </h1>

          {/* === YEH HAI NAYA BADLAV === */}
          {/* Ab hum 'username' state se user ka naam dikha rahe hain */}
          <p className="text-xl text-gray-700">
            Welcome, {username || 'Master Joy'}! Yahan se aap poori website ko control kar sakte hain.
          </p>
          
          <div className="mt-8 border-t pt-6">
              <p className="text-gray-600">Yahan par user management, post approval jaise features aayenge.</p>
          </div>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>

        </div>
      </RoleProtectedRoute>
    );
  };
  
  export default AdminDashboardPage;