const ContactPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        Humse Sampark Karein (Contact Us)
      </h1>
      
      <p className="text-center text-lg text-gray-600 mb-8">
        Aapke paas koi sawaal hai ya aap humse baat karna chahte hain? Neeche diye gaye form ko bharein.
      </p>

      {/* Action aur onSubmit abhi ke liye khali hain, backend se jodne par inka kaam aayega */}
      <form>
        {/* Name Input Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Aapka Naam
          </label>
          <input 
            type="text" 
            id="name" 
            name="name"
            placeholder="Yahan apna poora naam likhein"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Email Input Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Aapka Email
          </label>
          <input 
            type="email" 
            id="email" 
            name="email"
            placeholder="Yahan apna email address likhein"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Message Text Area */}
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
            Aapka Sandesh (Message)
          </label>
          <textarea 
            id="message" 
            name="message"
            rows={5}
            placeholder="Aap humse kya kehna chahte hain..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
          </textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button 
            type="submit"
            className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300"
          >
            Form Bhejein (Submit)
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
