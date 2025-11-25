import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Webpack configuration to handle Solana dependencies
  webpack: (config, { isServer }) => {
    // Fixes for Solana Web3.js in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Ignore warnings from Solana wallet adapters
    config.ignoreWarnings = [
      { module: /node_modules\/@solana/ },
      { module: /node_modules\/@coral-xyz/ },
    ];

    return config;
  },

  // Transpile Solana packages for better compatibility
  transpilePackages: [
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-wallets',
    '@solana/web3.js',
  ],

  // Environment variables available in browser
  env: {
    NEXT_PUBLIC_ARBITRUM_CHAIN_ID: process.env.NEXT_PUBLIC_ARBITRUM_CHAIN_ID,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_USDC_ADDRESS: process.env.NEXT_PUBLIC_USDC_ADDRESS,
  },
};

export default nextConfig;
