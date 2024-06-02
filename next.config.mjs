/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  output: "standalone", // Create a standalone (no npm packages) app for docker deployment
  basePath: "", //To deploy a Next.js application under a sub-path of a domain. When linking w/ pages using next/link or next/router basePath is automatically applied.
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
};

export default nextConfig;
