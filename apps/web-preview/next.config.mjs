/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @revyx/core is consumed as TS source from the workspace (P0-2).
  transpilePackages: ['@revyx/core'],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
