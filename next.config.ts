import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Webpack configuration for Node.js modules in browser
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Polyfills for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },

  // Environment variables available in browser
  env: {
    NEXT_PUBLIC_ARBITRUM_CHAIN_ID: process.env.NEXT_PUBLIC_ARBITRUM_CHAIN_ID,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_USDC_ADDRESS: process.env.NEXT_PUBLIC_USDC_ADDRESS,
  },
};

export default nextConfig;
