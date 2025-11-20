'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import toast from 'react-hot-toast';

const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

interface Settings {
  receivingWalletAddress: string;
  usdcTokenAddress: string;
  tokenSymbol: string;
  minimumDeposit: string;
  requiredConfirmations: number;
}

export function DepositModal({ isOpen, onClose, onSuccess }: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });
  
  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isConfirmed && hash) {
      handleTransactionConfirmed(hash);
    }
  }, [isConfirmed, hash]);
  
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load platform settings');
    }
  };
  
  const handleTransactionConfirmed = async (txHash: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/deposits/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash }),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Deposit tracked successfully!');
        onSuccess?.();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to track deposit');
      }
    } catch (error) {
      console.error('Error tracking deposit:', error);
      toast.error('Failed to track deposit');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeposit = async () => {
    if (!settings || !address) return;
    
    const amountNum = parseFloat(amount);
    const minDeposit = parseFloat(settings.minimumDeposit);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (amountNum < minDeposit) {
      toast.error(`Minimum deposit is ${minDeposit} ${settings.tokenSymbol}`);
      return;
    }
    
    try {
      writeContract({
        address: settings.usdcTokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [
          settings.receivingWalletAddress as `0x${string}`,
          parseUnits(amount, 6), // USDC typically has 6 decimals
        ],
      });
    } catch (error: any) {
      console.error('Error sending transaction:', error);
      toast.error(error.message || 'Failed to send transaction');
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };
  
  if (!settings) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Deposit {settings.tokenSymbol}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                ⚠️ <strong>Important:</strong> You are sending funds directly to the operator wallet. 
                Ensure you understand the risks before proceeding.
              </p>
            </div>
            
            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Amount ({settings.tokenSymbol})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: ${settings.minimumDeposit}`}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-arbitrum focus:outline-none"
                min={settings.minimumDeposit}
                step="0.01"
              />
              <p className="text-sm text-gray-400 mt-2">
                Minimum deposit: {settings.minimumDeposit} {settings.tokenSymbol}
              </p>
            </div>
            
            {/* Send Button */}
            <button
              onClick={handleDeposit}
              disabled={isPending || isConfirming || loading || !amount}
              className="w-full px-6 py-4 bg-arbitrum hover:bg-arbitrum-dark rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {isPending ? 'Confirm in wallet...' : 
               isConfirming ? 'Processing...' : 
               loading ? 'Tracking deposit...' : 
               'Send from Connected Wallet'}
            </button>
            
            <div className="border-t border-gray-700 pt-6">
              <h3 className="font-semibold mb-4">Or send manually:</h3>
              
              {/* Receiving Address */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Receiving Address (Arbitrum)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.receivingWalletAddress}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(settings.receivingWalletAddress)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              {/* Token Address */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Token Contract Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.usdcTokenAddress}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(settings.usdcTokenAddress)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              {/* QR Code */}
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <QRCodeSVG value={settings.receivingWalletAddress} size={200} />
              </div>
              
              <p className="text-sm text-gray-400 mt-4 text-center">
                Scan QR code with your mobile wallet
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
