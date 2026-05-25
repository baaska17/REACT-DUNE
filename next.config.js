/** @type {import('next').NextConfig} */
const nextConfig = {
  // Зэрэг ажиллах үед кэш хавтаснуудыг салгаж өгнө
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default nextConfig;
