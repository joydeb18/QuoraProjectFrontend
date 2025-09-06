import RoleProtectedRoute from "@/app/components/RoleProtectedRoute"; // Naye Super Bouncer ko import kiya

const DashboardPage = () => {
  return (
    // Humne bouncer ko bataya ki is page ke liye 'user' ka role zaroori hai.
    <RoleProtectedRoute requiredRole="user">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
          Welcome Back!
        </h1>
        
        <p className="text-xl text-gray-700 mb-8">
          You have successfully logged in to MeraBlog.
        </p>

        <div className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Dashboard
          </h2>
          <p className="text-gray-600">
            This is your personal space.
          </p>
        </div>
      </div>
    </RoleProtectedRoute>
  );
};

export default DashboardPage;