'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { signMessage } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  kycVerified: boolean;
  totalInvested: string;
  shares: string;
  createdAt: string;
}

export function useAuth() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  useEffect(() => {
    if (isConnected && address) {
      checkAuth();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [isConnected, address]);
  
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const authenticate = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return false;
    }
    
    setIsAuthenticating(true);
    
    try {
      // Step 1: Get nonce
      const nonceResponse = await fetch('/api/auth/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });
      
      if (!nonceResponse.ok) {
        throw new Error('Failed to get nonce');
      }
      
      const { nonce } = await nonceResponse.json();
      
      // Step 2: Sign message
      const message = `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'USDC Investment Platform'}!\n\nPlease sign this message to verify your wallet ownership.\n\nWallet: ${address}\nNonce: ${nonce}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;
      
      const signature = await signMessage(wagmiConfig, {
        message,
      });
      
      // Step 3: Verify signature
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          signature,
        }),
      });
      
      if (!verifyResponse.ok) {
        throw new Error('Failed to verify signature');
      }
      
      const { user: authenticatedUser } = await verifyResponse.json();
      setUser(authenticatedUser);
      toast.success('Successfully authenticated!');
      return true;
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Failed to authenticate');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('Logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return {
    user,
    loading,
    isAuthenticating,
    isAuthenticated: !!user,
    authenticate,
    logout,
    refetch: checkAuth,
  };
}
