// Step 1: Component ko 'use client' banana zaroori hai taaki hum button click handle kar sakein.
'use client'; 

import RoleProtectedRoute from "@/app/components/RoleProtectedRoute";
import { useRouter } from "next/navigation"; // Step 2: User ko redirect karne ke liye useRouter import kiya.

const AdminDashboardPage = () => {
    const router = useRouter(); // Step 3: router ko initialize kiya.

    // Step 4: Yahan humne 'handleLogout' function banaya.
    const handleLogout = () => {
        // Browser ki memory se token (ticket) ko hata do.
        localStorage.removeItem('blog_token');
        // User ko wapas login page par bhej do.
        router.push('/login');
    };

    return (
      // Humne bouncer ko bataya ki is page ke liye 'admin' ka role zaroori hai.
      <RoleProtectedRoute requiredRole="admin">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-5xl font-extrabold text-red-600 mb-4">
            Admin Control Panel
          </h1>
          <p className="text-xl text-gray-700">
            Welcome, Master! Yahan se aap poori website ko control kar sakte hain.
          </p>
          <div className="mt-8 border-t pt-6">
              <p className="text-gray-600">Yahan par user management, post approval jaise features aayenge.</p>
          </div>

          {/* Step 5: Ab yeh button 'handleLogout' function ko aaram se dhoondh lega. */}
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