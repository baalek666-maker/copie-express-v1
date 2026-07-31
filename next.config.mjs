/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000', 'copie-express.fr'] },
  },
};

export default nextConfig;
