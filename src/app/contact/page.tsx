const ContactPage = () => {
  return (
    <div className="p-8 rounded-lg shadow-md max-w-2xl mx-auto" style={{backgroundColor: '#1E1E1E'}}>
      <h1 className="text-4xl font-extrabold text-center mb-6" style={{color: '#FFFFFF'}}>
        Humse Sampark Karein (Contact Us)
      </h1>
      
      <p className="text-center text-lg mb-8" style={{color: '#B0B0B0'}}>
        Aapke paas koi sawaal hai ya aap humse baat karna chahte hain? Neeche diye gaye form ko bharein.
      </p>

      {/* Action aur onSubmit abhi ke liye khali hain, backend se jodne par inka kaam aayega */}
      <form>
        {/* Name Input Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block font-bold mb-2" style={{color: '#B0B0B0'}}>
            Aapka Naam
          </label>
          <input 
            type="text" 
            id="name" 
            name="name"
            placeholder="Yahan apna poora naam likhein"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{backgroundColor: '#2E2E2E', borderColor: '#FF9800', color: '#FFFFFF'}}
            required
          />
        </div>

        {/* Email Input Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block font-bold mb-2" style={{color: '#B0B0B0'}}>
            Aapka Email
          </label>
          <input 
            type="email" 
            id="email" 
            name="email"
            placeholder="Yahan apna email address likhein"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{backgroundColor: '#2E2E2E', borderColor: '#FF9800', color: '#FFFFFF'}}
            required
          />
        </div>

        {/* Message Text Area */}
        <div className="mb-6">
          <label htmlFor="message" className="block font-bold mb-2" style={{color: '#B0B0B0'}}>
            Aapka Sandesh (Message)
          </label>
          <textarea 
            id="message" 
            name="message"
            rows={5}
            placeholder="Aap humse kya kehna chahte hain..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{backgroundColor: '#2E2E2E', borderColor: '#FF9800', color: '#FFFFFF'}}
            required
          >
          </textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button 
            type="submit"
            className="font-bold py-3 px-8 rounded-full transition duration-300"
            style={{backgroundColor: '#FF9800', color: '#FFFFFF'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFB74D'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
          >
            Form Bhejein (Submit)
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
