'use client';

import { useState, useEffect } from 'react';
import { mockAPI, dataRefreshService } from '@/services/api';

interface AIAlert {
  id: number;
  type: string;
  message: string;
  severity: string;
  timestamp: string;
  confidence: number;
}

interface AIPrediction {
  trend: string;
  probability: number;
  targetPrice: string;
  timeframe: string;
  support: string;
  resistance: string;
  confidence: number;
}

interface StrategicInsight {
  type: string;
  title: string;
  description: string;
  action: string;
  priority: string;
}

interface AIStatus {
  status: string;
  mode: string;
  assetsAnalyzed: number;
  avgPerformance: string;
  lastUpdate: string;
  uptime: string;
  modelsActive: number;
}

export function useAIInsights() {
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [predictions, setPredictions] = useState<Record<string, AIPrediction> | null>(null);
  const [insights, setInsights] = useState<StrategicInsight[]>([]);
  const [status, setStatus] = useState<AIStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [alertsData, predictionsData, insightsData, statusData] = await Promise.all([
        mockAPI.getAIAlerts(),
        mockAPI.getAIPredictions(),
        mockAPI.getStrategicInsights(),
        mockAPI.getAIStatus(),
      ]);

      setAlerts(alertsData);
      setPredictions(predictionsData);
      setInsights(insightsData);
      setStatus(statusData);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar insights da IA:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Busca inicial
    fetchData();

    // Atualização automática a cada 10 segundos
    const stopRefresh = dataRefreshService.startAutoRefresh(() => {
      fetchData();
    }, 10000);

    return () => {
      stopRefresh();
    };
  }, []);

  return { alerts, predictions, insights, status, loading, refetch: fetchData };
}
