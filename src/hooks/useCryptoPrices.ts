'use client';

import { useState, useEffect } from 'react';
import { mockAPI, dataRefreshService } from '@/services/api';

interface CryptoPrice {
  symbol: string;
  name: string;
  price: string;
  change24h: number;
  volume24h: string;
  marketCap: string;
  lastUpdate: string;
}

interface CryptoPrices {
  BTC: CryptoPrice;
  ETH: CryptoPrice;
  SOL: CryptoPrice;
}

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      const data = await mockAPI.getPrices();
      setPrices(data);
      setLoading(false);
      setError(null);
    } catch {
      setError('Erro ao buscar preços');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Busca inicial
    fetchPrices();

    // Atualização automática a cada 5 segundos
    const stopRefresh = dataRefreshService.startAutoRefresh(() => {
      fetchPrices();
    }, 5000);

    return () => {
      stopRefresh();
    };
  }, []);

  return { prices, loading, error, refetch: fetchPrices };
}
