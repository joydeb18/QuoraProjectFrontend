import type { Config } from "tailwindcss";

const config: Config = {
  // Yeh Tailwind ko batata hai ki aapki kaun si files ko scan karna hai
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Yahan aap custom colors ya fonts add kar sakte hain
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  // Yahan hum naye features (plugins) add karte hain
  plugins: [
    require('@tailwindcss/typography'), // Yeh 'prose' class ke liye zaroori hai
  ],
};
export default config;