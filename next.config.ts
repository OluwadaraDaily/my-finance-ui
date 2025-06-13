import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot'],
  },
  
  // Optimize images
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Enable compression
  compress: true,
  
  // Optimize bundles
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
