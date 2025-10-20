/**
 * Bot Configuration Form Component
 * 
 * Form to create and configure a new trading bot with Wyckoff strategy parameters
 */

'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';

export interface BotFormData {
  name: string;
  market: string;
  mode: 'non-custodial' | 'custodial';
  
  // Strategy parameters
  timeframe: number;
  lookbackBars: number;
  volumeThreshold: number;
  accumulationSensitivity: number;
  distributionSensitivity: number;
  
  // Risk management
  positionSizePct: number;
  maxLeverage: number;
  stopLossPct: number;
  takeProfitPct: number;
}

interface BotConfigFormProps {
  onSubmit: (data: BotFormData) => void;
  isLoading?: boolean;
}

export const BotConfigForm: React.FC<BotConfigFormProps> = ({ onSubmit, isLoading }) => {
  const { isConnected } = useAccount();
  const [showCustodialWarning, setShowCustodialWarning] = useState(false);
  const [acceptedRisk, setAcceptedRisk] = useState(false);

  const [formData, setFormData] = useState<BotFormData>({
    name: 'My Wyckoff Bot',
    market: 'BTC',
    mode: 'non-custodial',
    timeframe: 5,
    lookbackBars: 12,
    volumeThreshold: 1.5,
    accumulationSensitivity: 0.7,
    distributionSensitivity: 0.7,
    positionSizePct: 10,
    maxLeverage: 5,
    stopLossPct: 10,
    takeProfitPct: 40,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Show warning when switching to custodial mode
    if (name === 'mode' && value === 'custodial') {
      setShowCustodialWarning(true);
      setAcceptedRisk(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.mode === 'custodial' && !acceptedRisk) {
      alert('Please accept the custodial mode risks before proceeding');
      return;
    }

    onSubmit(formData);
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">Please connect your wallet to create a bot</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-6">
      {/* Basic Configuration */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Basic Configuration</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bot Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Market
          </label>
          <select
            name="market"
            value={formData.market}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="SOL">SOL</option>
            <option value="ARB">ARB</option>
            <option value="AVAX">AVAX</option>
            <option value="MATIC">MATIC</option>
            <option value="OP">OP</option>
            <option value="LINK">LINK</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mode
          </label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="non-custodial">Non-Custodial (You sign each trade)</option>
            <option value="custodial">Custodial (Automated - Testing Only)</option>
          </select>
        </div>
      </div>

      {/* Custodial Mode Warning */}
      {showCustodialWarning && formData.mode === 'custodial' && (
        <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-red-400 mb-2">
                CUSTODIAL MODE WARNING
              </h4>
              <ul className="text-sm text-red-300 space-y-1 list-disc list-inside">
                <li>Your private key will be used by the server to sign transactions automatically</li>
                <li>This is NOT recommended for mainnet or large amounts</li>
                <li>ONLY use on testnet for development and testing</li>
                <li>The server must have KEEPER_PRIVATE_KEY environment variable set</li>
                <li>You could lose all funds if the server is compromised</li>
                <li>Automated trading involves significant financial risk</li>
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="acceptRisk"
                  checked={acceptedRisk}
                  onChange={(e) => setAcceptedRisk(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="acceptRisk" className="text-sm text-red-300 font-medium">
                  I understand the risks and am using this on testnet only
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wyckoff Strategy Parameters */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Wyckoff Strategy (5-min)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lookback Bars (12 = 1 hour)
            </label>
            <input
              type="number"
              name="lookbackBars"
              value={formData.lookbackBars}
              onChange={handleChange}
              min="5"
              max="50"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Volume Threshold (multiplier)
            </label>
            <input
              type="number"
              name="volumeThreshold"
              value={formData.volumeThreshold}
              onChange={handleChange}
              step="0.1"
              min="1"
              max="5"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Accumulation Sensitivity (0-1)
            </label>
            <input
              type="number"
              name="accumulationSensitivity"
              value={formData.accumulationSensitivity}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="1"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Distribution Sensitivity (0-1)
            </label>
            <input
              type="number"
              name="distributionSensitivity"
              value={formData.distributionSensitivity}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="1"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Risk Management</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Position Size (% of equity)
            </label>
            <input
              type="number"
              name="positionSizePct"
              value={formData.positionSizePct}
              onChange={handleChange}
              min="1"
              max="100"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Leverage
            </label>
            <input
              type="number"
              name="maxLeverage"
              value={formData.maxLeverage}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stop Loss (%)
            </label>
            <input
              type="number"
              name="stopLossPct"
              value={formData.stopLossPct}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Take Profit (%)
            </label>
            <input
              type="number"
              name="takeProfitPct"
              value={formData.takeProfitPct}
              onChange={handleChange}
              min="1"
              max="500"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* General Risk Warning */}
      <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <span className="text-xl">⚠️</span>
          <div className="flex-1 text-sm text-yellow-300">
            <strong>Risk Warning:</strong> Automated trading involves significant financial risk. 
            You could lose all or part of your investment. Only trade with funds you can afford to lose. 
            Always test on testnet before using real funds.
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || (formData.mode === 'custodial' && !acceptedRisk)}
        className="w-full py-3 px-6 bg-primary hover:bg-primary-dark disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
      >
        {isLoading ? 'Creating Bot...' : 'Create Bot'}
      </button>
    </form>
  );
};

export default BotConfigForm;
