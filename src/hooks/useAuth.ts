'use client';

import { useAccount, useSignMessage } from 'wagmi';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useAuth() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticate = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return false;
    }

    setIsAuthenticating(true);

    try {
      // Step 1: Get nonce from server
      const nonceRes = await fetch('/api/auth/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });

      if (!nonceRes.ok) {
        throw new Error('Failed to get authentication nonce');
      }

      const { message } = await nonceRes.json();

      // Step 2: Sign the message
      const signature = await signMessageAsync({ message });

      // Step 3: Verify signature with server
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message,
        }),
      });

      if (!verifyRes.ok) {
        throw new Error('Authentication failed');
      }

      await verifyRes.json();

      toast.success('Successfully authenticated!');
      return true;
    } catch (error) {
      console.error('Authentication error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Authentication failed';

      if (errorMessage.includes('User rejected')) {
        toast.error('Signature request rejected');
      } else {
        toast.error('Authentication failed. Please try again.');
      }

      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    authenticate,
    isAuthenticating,
  };
}
