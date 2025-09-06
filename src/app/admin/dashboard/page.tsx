import RoleProtectedRoute from "@/app/components/RoleProtectedRoute"; // Naye Super Bouncer ko import kiya

const AdminDashboardPage = () => {
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
        </div>
      </RoleProtectedRoute>
    );
  };
  
  export default AdminDashboardPage;