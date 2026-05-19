/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed rewrites - using API route handler instead
  // API route at /app/api/[...path]/route.js handles proxying to BACKEND_URL
};

module.exports = nextConfig;
