// Line 1: Next.js se 'Link' component ko import kar rahe hain.
// Yeh component bina page refresh kiye ek page se doosre page par jaane mein madad karta hai.
import Link from 'next/link';

// Line 4: Hum 'SignupPage' naam ka ek function component bana rahe hain.
// Yeh function screen par dikhne wala HTML jaisa code (JSX) taiyaar karega.
const SignupPage = () => {
  return (
    // Line 7: Yeh ek main container (box) hai.
    // Tailwind CSS classes se isko design kiya gaya hai:
    // - `bg-white`: Background safed (white).
    // - `p-8`: Box ke andar charo taraf se padding (khaali jagah).
    // - `rounded-lg`: Box ke kone halke se gol.
    // - `shadow-md`: Box ke neeche halki si parchai.
    // - `max-w-md`: Box ki maximum chaudai (width) 'medium' size tak hi rahegi.
    // - `mx-auto`: Box page ke beech mein (horizontally centered) aa jayega.
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      
      {/* Page ki main heading */}
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        Create a New Account
      </h1>
      
      {/* Heading ke neeche ek chota sa description */}
      <p className="text-center text-gray-600 mb-8">
        Join the MeraBlog community today!
      </p>

      {/* Yeh HTML form hai jismein saare input fields hain */}
      <form>
        {/* Name Input Field ka section */}
        <div className="mb-4">
          {/* 'htmlFor' attribute 'input' ke 'id' se connect hota hai, accessibility ke liye accha hai */}
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Full Name
          </label>
          <input 
            type="text" // Input ka type text hai.
            id="name" // Is input field ki unique ID.
            name="name" // Form submit hone par is field ka naam.
            placeholder="Enter your full name" // Jab box khaali ho toh yeh text dikhega.
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" // Styling classes
            required // Iska matlab hai ki is field ko bharna zaroori hai.
          />
        </div>

        {/* Email Input Field ka section */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email Address
          </label>
          <input 
            type="email" // Input ka type email hai, browser email format check karega.
            id="email" 
            name="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required 
          />
        </div>

        {/* Password Input Field ka section */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Password
          </label>
          <input 
            type="password" // Input ka type password hai, likha hua text dots (••••) mein dikhega.
            id="password" 
            name="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required 
          />
        </div>

        {/* Signup Button ka section */}
        <div className="text-center mb-6">
          <button 
            type="submit" // Button ka type submit hai, ispar click karne se form submit hoga.
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </form>

      {/* Login page par wapas jaane ke liye link */}
      <div className="text-center text-gray-600">
        Already have an account?{' '}
        {/* 'href="/login"' batata hai ki is link par click karne se '/login' URL par jaana hai */}
        <Link href="/login" className="text-blue-500 hover:underline font-bold">
          Login Here
        </Link>
      </div>
    </div>
  );
};

// Line 110: 'SignupPage' component ko is file se export kar rahe hain.
// Iske bina Next.js is page ko istemaal nahi kar payega.
export default SignupPage;

