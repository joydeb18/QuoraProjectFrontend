/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Humne yahan purane 'tailwindcss' ki jagah naya '@tailwindcss/postcss' use kiya hai
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;