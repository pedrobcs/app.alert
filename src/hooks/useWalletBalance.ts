'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { mockAPI, dataRefreshService } from '@/services/api';

interface WalletBalance {
  total: string;
  usdc: string;
  sol: string;
  eth: string;
  change24h: string;
  lastUpdate: string;
}

export function useWalletBalance() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    if (!isConnected || !address) {
      setLoading(false);
      return;
    }

    try {
      const data = await mockAPI.getWalletBalance(address);
      setBalance(data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar saldo:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      setBalance(null);
      setLoading(false);
      return;
    }

    // Busca inicial
    fetchBalance();

    // Atualização automática a cada 5 segundos
    const stopRefresh = dataRefreshService.startAutoRefresh(() => {
      fetchBalance();
    }, 5000);

    return () => {
      stopRefresh();
    };
  }, [isConnected, address]);

  return { balance, loading, refetch: fetchBalance };
}
