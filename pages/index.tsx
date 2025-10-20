/**
 * Home Page / Dashboard
 * 
 * Main landing page with wallet connection and bot management
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnectButton } from '@/components/WalletConnector';
import Link from 'next/link';
import { BotStatus } from '@/components/BotStatus';
import { TradeLog, Trade } from '@/components/TradeLog';

interface Bot {
  id: string;
  name: string;
  market: string;
  mode: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const { connected, publicKey } = useWallet();
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [botStatus, setBotStatus] = useState<any>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's bots
  useEffect(() => {
    if (connected && publicKey) {
      fetchBots();
    } else {
      setBots([]);
      setSelectedBot(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey]);

  // Fetch bot status and trades when a bot is selected
  useEffect(() => {
    if (selectedBot) {
      fetchBotStatus(selectedBot.id);
      fetchTrades(selectedBot.id);
    }
  }, [selectedBot]);

  const fetchBots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bots/list?wallet=${publicKey?.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBots(data.bots || []);
        if (data.bots && data.bots.length > 0) {
          setSelectedBot(data.bots[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBotStatus = async (botId: string) => {
    try {
      const response = await fetch(`/api/bots/status?botId=${botId}`);
      if (response.ok) {
        const data = await response.json();
        setBotStatus(data);
      }
    } catch (error) {
      console.error('Error fetching bot status:', error);
    }
  };

  const fetchTrades = async (botId: string) => {
    try {
      const response = await fetch(`/api/bots/trades?botId=${botId}`);
      if (response.ok) {
        const data = await response.json();
        setTrades(data.trades || []);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const handleStartBot = async (botId: string) => {
    try {
      const response = await fetch('/api/bots/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId }),
      });
      if (response.ok) {
        await fetchBots();
        await fetchBotStatus(botId);
      } else {
        const error = await response.json();
        alert(`Failed to start bot: ${error.error}`);
      }
    } catch (error) {
      console.error('Error starting bot:', error);
      alert('Failed to start bot');
    }
  };

  const handleStopBot = async (botId: string) => {
    try {
      const response = await fetch('/api/bots/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId }),
      });
      if (response.ok) {
        await fetchBots();
        await fetchBotStatus(botId);
      }
    } catch (error) {
      console.error('Error stopping bot:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📈</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Drift Trading Bot</h1>
                <p className="text-sm text-gray-400">Wyckoff Strategy • 5-min Timeframe</p>
              </div>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!connected ? (
          // Not Connected View
          <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to Drift Trading Bot
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Automated futures trading on Solana using Wyckoff strategy
            </p>
            
            <div className="bg-gray-800 rounded-lg p-8 space-y-4 text-left">
              <h3 className="text-2xl font-bold text-white mb-4">Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Wyckoff accumulation/distribution detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>5-minute timeframe for responsive trading</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Automated position management with stop-loss & take-profit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Non-custodial and custodial modes available</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Real-time trade monitoring and performance tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 text-left">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-yellow-400 mb-2">Important Notice</h4>
                  <p className="text-sm text-yellow-300">
                    Trading involves significant financial risk. This bot is provided for educational 
                    and testing purposes. Always test on devnet first and never invest more than you 
                    can afford to lose.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <WalletConnectButton />
            </div>
          </div>
        ) : (
          // Connected View
          <div className="space-y-6">
            {/* Bots List */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Your Bots</h2>
                <Link
                  href="/bots/new"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
                >
                  + Create New Bot
                </Link>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-gray-400">Loading bots...</div>
              ) : bots.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="mb-4">No bots yet. Create your first bot to get started!</p>
                  <Link
                    href="/bots/new"
                    className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
                  >
                    Create Bot
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bots.map((bot) => (
                    <div
                      key={bot.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedBot?.id === bot.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-700 bg-gray-700/30 hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedBot(bot)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
                        <StatusDot status={bot.status} />
                      </div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>Market: {bot.market}</div>
                        <div>Mode: {bot.mode}</div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {bot.status === 'running' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStopBot(bot.id);
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                          >
                            Stop
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartBot(bot.id);
                            }}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                          >
                            Start
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bot Details */}
            {selectedBot && botStatus && (
              <BotStatus
                botId={selectedBot.id}
                name={selectedBot.name}
                market={selectedBot.market}
                status={botStatus.status}
                lastSignal={botStatus.lastSignal}
                lastSignalTime={botStatus.lastSignalTime}
                currentPosition={botStatus.currentPosition}
                stats={botStatus.stats}
                errorMessage={botStatus.errorMessage}
              />
            )}

            {/* Trade Log */}
            {selectedBot && (
              <TradeLog trades={trades} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>
            Built with{' '}
            <a href="https://drift.trade" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Drift Protocol
            </a>{' '}
            • Trade responsibly
          </p>
          <p className="mt-2">
            <a href="https://docs.drift.trade" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Documentation
            </a>
            {' | '}
            <a href="https://github.com/drift-labs" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  const colors = {
    running: 'bg-green-500',
    stopped: 'bg-gray-500',
    paused: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const colorClass = colors[status as keyof typeof colors] || colors.stopped;

  return <div className={`w-3 h-3 rounded-full ${colorClass} ${status === 'running' ? 'animate-pulse' : ''}`} />;
};
