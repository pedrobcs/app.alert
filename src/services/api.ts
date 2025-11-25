// Mock API Service - Simulação de dados reais
// Atualiza a cada 5 segundos automaticamente

// Gera variação realista de preço
const generatePriceVariation = (basePrice: number, volatility: number = 0.001) => {
  const variation = (Math.random() - 0.5) * basePrice * volatility;
  return basePrice + variation;
};

// Gera dados de gráfico
const generateChartData = (points: number = 24, baseValue: number = 50) => {
  const data = [];
  let value = baseValue;
  
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.48) * 5;
    value = Math.max(20, Math.min(80, value));
    data.push({
      time: new Date(Date.now() - (points - i) * 3600000).toISOString(),
      value: value,
      volume: Math.random() * 1000000000,
    });
  }
  
  return data;
};

// Preços base das criptomoedas
// Note: Usando let porque precisamos mutar os valores para simular variação em tempo real
// eslint-disable-next-line prefer-const
let cryptoPrices = {
  BTC: 95420.50,
  ETH: 3245.80,
  SOL: 142.35,
};

// ============================================
// ENDPOINTS SIMULADOS
// ============================================

export const mockAPI = {
  // Preços em tempo real
  getPrices: async () => {
    // Atualiza preços com variação realista
    cryptoPrices.BTC = generatePriceVariation(cryptoPrices.BTC, 0.0015);
    cryptoPrices.ETH = generatePriceVariation(cryptoPrices.ETH, 0.002);
    cryptoPrices.SOL = generatePriceVariation(cryptoPrices.SOL, 0.003);

    const btcChange = ((Math.random() - 0.5) * 5).toFixed(2);
    const ethChange = ((Math.random() - 0.5) * 6).toFixed(2);
    const solChange = ((Math.random() - 0.5) * 8).toFixed(2);

    return {
      BTC: {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: cryptoPrices.BTC.toFixed(2),
        change24h: parseFloat(btcChange),
        volume24h: (Math.random() * 50 + 20).toFixed(1) + 'B',
        marketCap: '1.87T',
        lastUpdate: new Date().toISOString(),
      },
      ETH: {
        symbol: 'ETH',
        name: 'Ethereum',
        price: cryptoPrices.ETH.toFixed(2),
        change24h: parseFloat(ethChange),
        volume24h: (Math.random() * 20 + 10).toFixed(1) + 'B',
        marketCap: '390B',
        lastUpdate: new Date().toISOString(),
      },
      SOL: {
        symbol: 'SOL',
        name: 'Solana',
        price: cryptoPrices.SOL.toFixed(2),
        change24h: parseFloat(solChange),
        volume24h: (Math.random() * 5 + 2).toFixed(1) + 'B',
        marketCap: '67B',
        lastUpdate: new Date().toISOString(),
      },
    };
  },

  // Alertas Inteligentes da IA
  getAIAlerts: async () => {
    const alerts = [
      {
        id: 1,
        type: 'breakout',
        message: 'BTC rompeu resistência em $95k',
        severity: 'high',
        timestamp: new Date().toISOString(),
        confidence: 87,
      },
      {
        id: 2,
        type: 'volume',
        message: 'ETH com volume 35% acima da média',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        confidence: 92,
      },
      {
        id: 3,
        type: 'trend',
        message: 'SOL formando padrão de alta no 4h',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        confidence: 78,
      },
    ];

    // Randomiza um alerta
    const randomIndex = Math.floor(Math.random() * alerts.length);
    alerts[randomIndex].message = alerts[randomIndex].message + ` [${new Date().toLocaleTimeString()}]`;

    return alerts;
  },

  // Previsões da IA
  getAIPredictions: async () => {
    return {
      BTC: {
        trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
        probability: Math.floor(Math.random() * 30 + 60),
        targetPrice: (cryptoPrices.BTC * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2),
        timeframe: '24-48h',
        support: (cryptoPrices.BTC * 0.95).toFixed(2),
        resistance: (cryptoPrices.BTC * 1.05).toFixed(2),
        confidence: Math.floor(Math.random() * 20 + 75),
      },
      ETH: {
        trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
        probability: Math.floor(Math.random() * 30 + 60),
        targetPrice: (cryptoPrices.ETH * (1 + (Math.random() - 0.5) * 0.12)).toFixed(2),
        timeframe: '24-48h',
        support: (cryptoPrices.ETH * 0.94).toFixed(2),
        resistance: (cryptoPrices.ETH * 1.06).toFixed(2),
        confidence: Math.floor(Math.random() * 20 + 75),
      },
      SOL: {
        trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
        probability: Math.floor(Math.random() * 30 + 60),
        targetPrice: (cryptoPrices.SOL * (1 + (Math.random() - 0.5) * 0.15)).toFixed(2),
        timeframe: '24-48h',
        support: (cryptoPrices.SOL * 0.93).toFixed(2),
        resistance: (cryptoPrices.SOL * 1.07).toFixed(2),
        confidence: Math.floor(Math.random() * 20 + 75),
      },
    };
  },

  // Insights Estratégicos
  getStrategicInsights: async () => {
    const strategies = [
      {
        type: 'DCA',
        title: 'DCA Recomendado',
        description: 'Momento ideal para Dollar Cost Average em BTC',
        action: 'Comprar gradualmente',
        priority: 'high',
      },
      {
        type: 'SWING',
        title: 'Oportunidade de Swing',
        description: 'ETH próximo a suporte forte em $3.2k',
        action: 'Aguardar confirmação',
        priority: 'medium',
      },
      {
        type: 'TREND',
        title: 'Tendência Detectada',
        description: 'SOL em tendência de alta no timeframe diário',
        action: 'Considerar posição',
        priority: 'medium',
      },
      {
        type: 'HEDGE',
        title: 'Sugestão de Hedge',
        description: 'Diversificar entre BTC e stablecoins',
        action: 'Rebalancear portfolio',
        priority: 'low',
      },
    ];

    return strategies;
  },

  // Saldo da carteira
  getWalletBalance: async (_address?: string) => {
    return {
      total: (12450.50 + Math.random() * 100).toFixed(2),
      usdc: (8500 + Math.random() * 50).toFixed(2),
      sol: (2.5 + Math.random() * 0.5).toFixed(4),
      eth: (0.8 + Math.random() * 0.1).toFixed(4),
      change24h: (12.5 + (Math.random() - 0.5) * 2).toFixed(2),
      lastUpdate: new Date().toISOString(),
    };
  },

  // Dados de gráfico BTC
  getChartBTC: async () => {
    return generateChartData(24, 60);
  },

  // Dados de gráfico ETH
  getChartETH: async () => {
    return generateChartData(24, 55);
  },

  // Dados de gráfico SOL
  getChartSOL: async () => {
    return generateChartData(24, 50);
  },

  // Status da IA
  getAIStatus: async () => {
    return {
      status: 'active',
      mode: 'optimizing',
      assetsAnalyzed: Math.floor(Math.random() * 1000 + 5000),
      avgPerformance: (85 + Math.random() * 10).toFixed(1) + '%',
      lastUpdate: new Date().toISOString(),
      uptime: '99.9%',
      modelsActive: 12,
    };
  },
};

// ============================================
// HOOKS PARA ATUALIZAÇÃO AUTOMÁTICA
// ============================================

export class DataRefreshService {
  private intervals: NodeJS.Timeout[] = [];

  startAutoRefresh(
    callback: () => void,
    intervalMs: number = 5000
  ): () => void {
    const interval = setInterval(callback, intervalMs);
    this.intervals.push(interval);

    // Retorna função para parar o refresh
    return () => {
      clearInterval(interval);
      this.intervals = this.intervals.filter(i => i !== interval);
    };
  }

  stopAll() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }
}

export const dataRefreshService = new DataRefreshService();
