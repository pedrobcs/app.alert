/**
 * Wallet Connector Component
 * 
 * Provides Solana wallet connection functionality using wallet-adapter
 * 
 * Supported wallets:
 * - Phantom
 * - Solflare
 * - Coinbase Wallet
 * - And more via wallet-adapter
 * 
 * Reference: https://solana.com/developers/cookbook/wallets/connect-wallet-react
 */

'use client';

import React, { FC, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

interface WalletConnectorProviderProps {
  children: React.ReactNode;
}

/**
 * Wallet Connector Provider
 * Wrap your app with this component to enable wallet functionality
 */
export const WalletConnectorProvider: FC<WalletConnectorProviderProps> = ({ children }) => {
  // Get network from environment or default to devnet
  const network = (process.env.NEXT_PUBLIC_DRIFT_ENV as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;
  
  // Get RPC endpoint
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_RPC_URL) {
      return process.env.NEXT_PUBLIC_RPC_URL;
    }
    return clusterApiUrl(network);
  }, [network]);

  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new CoinbaseWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

/**
 * Wallet Connect Button
 * Pre-styled button for connecting/disconnecting wallet
 */
export const WalletConnectButton: FC = () => {
  return <WalletMultiButton className="!bg-primary hover:!bg-primary-dark transition-colors" />;
};

/**
 * Wallet Info Display
 * Shows connected wallet address and balance
 */
export const WalletInfo: FC = () => {
  const { publicKey, connected } = useWallet();

  if (!connected || !publicKey) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm text-gray-300">
        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
      </span>
    </div>
  );
};

export default WalletConnectorProvider;
