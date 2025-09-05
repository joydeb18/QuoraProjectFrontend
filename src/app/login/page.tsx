import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        Login Here
      </h1>
      
      <p className="text-center text-gray-600 mb-8">
        Welcome to JoyBlog!
      </p>

      <form>
        {/* Email Input Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email Address
          </label>
          <input 
            type="email" 
            id="email" 
            name="email"
            placeholder="aapka@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Password Input Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Password
          </label>
          <input 
            type="password" 
            id="password" 
            name="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Login Button */}
        <div className="text-center mb-6">
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </div>
      </form>

      {/* Signup Link */}
      <div className="text-center text-gray-600">
       Not your account?{' '}
        <Link href="/signup" className="text-blue-500 hover:underline font-bold">
          SignUp Here<Link href="/signup" className="text-blue-500 hover:underline font-bold">
          </Link>  
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
