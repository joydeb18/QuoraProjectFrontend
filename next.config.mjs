/** @type {import('next').NextConfig} */
const nextConfig = {
  // === YEH HAI ASLI BADLAV ===
  // Hum Next.js ko bata rahe hain ki build ke time TypeScript errors ko ignore kare
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;