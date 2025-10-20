/**
 * Wallet Connector Component
 * 
 * Provides EVM wallet connection functionality using wagmi + Web3Modal
 * 
 * Supported wallets:
 * - MetaMask
 * - WalletConnect
 * - Coinbase Wallet
 * - And more via Web3Modal
 * 
 * Reference: https://wagmi.sh/react/getting-started
 */

'use client';

import React, { FC, ReactNode } from 'react';
import { WagmiProvider, createConfig, http, useAccount, useDisconnect, useConnect } from 'wagmi';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

// Create wagmi config
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

const isMainnet = process.env.NEXT_PUBLIC_HYPERLIQUID_ENV === 'mainnet';

export const config = createConfig({
  chains: [isMainnet ? arbitrum : arbitrumSepolia],
  connectors: [
    walletConnect({ projectId }),
    injected(),
    coinbaseWallet({ appName: 'Hyperliquid Trading Bot' }),
  ],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

// Create Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  themeMode: 'dark',
});

// Create query client
const queryClient = new QueryClient();

interface WalletConnectorProviderProps {
  children: ReactNode;
}

/**
 * Wallet Connector Provider
 * Wrap your app with this component to enable wallet functionality
 */
export const WalletConnectorProvider: FC<WalletConnectorProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

/**
 * Wallet Connect Button
 * Pre-styled button for connecting/disconnecting wallet
 */
export const WalletConnectButton: FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();

  const handleConnect = () => {
    // Try to connect with injected wallet (MetaMask) first
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    } else if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
    >
      Connect Wallet
    </button>
  );
};

/**
 * Wallet Info Display
 * Shows connected wallet address and balance
 */
export const WalletInfo: FC = () => {
  const { address, isConnected, chain } = useAccount();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm text-gray-300">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
      {chain && (
        <span className="text-xs text-gray-500 ml-2">
          {chain.name}
        </span>
      )}
    </div>
  );
};

/**
 * Hook to check if wallet is connected
 */
export const useWalletConnection = () => {
  const { address, isConnected } = useAccount();
  return { address, isConnected };
};

export default WalletConnectorProvider;
