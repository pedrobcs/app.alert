'use client';

import { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, QrCode, CheckCircle2, AlertCircle, Zap, Sparkles } from 'lucide-react';
import { getArbiscanAddressLink } from '@/lib/utils';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { ERC20_ABI, ACTIVE_USDC_ADDRESS, USDC_DECIMALS } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';

interface DepositModalMultiChainProps {
  isOpen: boolean;
  onClose: () => void;
  operatorWallet: string;
  solanaWallet?: string;
  tokenSymbol: string;
  minimumDeposit: number;
}

type Chain = 'arbitrum' | 'solana';

export function DepositModalMultiChain({
  isOpen,
  onClose,
  operatorWallet,
  solanaWallet,
  tokenSymbol,
  minimumDeposit,
}: DepositModalMultiChainProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [trackingTx, setTrackingTx] = useState(false);
  const [txTracked, setTxTracked] = useState(false);
  const [selectedChain, setSelectedChain] = useState<Chain>('arbitrum');

  const { writeContract, data: hash, error, isPending, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const activeWallet = selectedChain === 'solana' ? solanaWallet : operatorWallet;
  const chainName = selectedChain === 'arbitrum' ? 'Arbitrum' : 'Solana';
  const explorerLink = selectedChain === 'arbitrum' 
    ? `https://arbiscan.io/tx/` 
    : `https://solscan.io/tx/`;

  const copyAddress = () => {
    if (activeWallet) {
      navigator.clipboard.writeText(activeWallet);
      toast.success('Address copied!', {
        icon: '📋',
        style: {
          borderRadius: '16px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const handleSendUSDC = async () => {
    if (!amount || parseFloat(amount) < minimumDeposit) {
      toast.error(`Minimum deposit is ${minimumDeposit} ${tokenSymbol}`, {
        icon: '⚠️',
        style: {
          borderRadius: '16px',
        },
      });
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (selectedChain === 'solana') {
      toast.error('Solana deposits coming soon! Use Arbitrum for now.', {
        icon: '🚀',
        duration: 4000,
      });
      return;
    }

    try {
      const amountWei = parseUnits(amount, USDC_DECIMALS);

      writeContract({
        address: ACTIVE_USDC_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [operatorWallet as `0x${string}`, amountWei],
      });
    } catch (err) {
      console.error('Transfer error:', err);
      toast.error('Failed to initiate transfer');
    }
  };

  const trackTransaction = async (txHash: string) => {
    if (!address || trackingTx || txTracked) return;

    try {
      setTrackingTx(true);
      
      toast.loading('Tracking your deposit...', { id: 'tracking' });

      const res = await fetch('/api/deposits/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash,
          userAddress: address,
          chain: selectedChain,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to track deposit');
      }

      toast.success('Deposit tracked successfully!', { 
        id: 'tracking',
        icon: '✅',
        style: {
          borderRadius: '16px',
        },
      });
      setTxTracked(true);
      
      setTimeout(() => {
        window.location.href = '/deposits';
      }, 2000);
    } catch (err: any) {
      console.error('Track error:', err);
      toast.error(err.message || 'Failed to track deposit', { id: 'tracking' });
      
      setTimeout(() => {
        onClose();
      }, 3000);
    } finally {
      setTrackingTx(false);
    }
  };

  useEffect(() => {
    if (isSuccess && hash && !trackingTx && !txTracked) {
      trackTransaction(hash);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setShowQR(false);
      setTrackingTx(false);
      setTxTracked(false);
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-md safe-bottom"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
        >
          {/* Header - Apple Style */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 flex items-center justify-between rounded-t-3xl md:rounded-t-3xl z-10">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <h2 className="text-2xl font-bold">Make a Deposit</h2>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="p-6 space-y-6">
            {/* Chain Selector - Apple Style Pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-100 p-1.5 rounded-2xl flex gap-1.5"
            >
              {[
                { id: 'arbitrum', name: 'Arbitrum', icon: Zap, available: true },
                { id: 'solana', name: 'Solana', icon: Sparkles, available: !!solanaWallet },
              ].map((chain) => (
                <motion.button
                  key={chain.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedChain(chain.id as Chain)}
                  disabled={!chain.available}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 ${
                    selectedChain === chain.id
                      ? 'bg-white text-blue-600 shadow-lg'
                      : chain.available
                      ? 'text-gray-600 hover:text-gray-900'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <chain.icon className="w-4 h-4" />
                  <span>{chain.name}</span>
                  {!chain.available && <span className="text-xs">(Soon)</span>}
                </motion.button>
              ))}
            </motion.div>

            {/* Warning */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900">
                  <strong className="font-bold">Important:</strong> Funds are sent directly to the operator
                  wallet. Only invest what you can afford to lose.
                </div>
              </div>
            </motion.div>

            {/* Transaction Success */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-green-900 mb-1">Success!</h4>
                    <p className="text-sm text-green-800 mb-2">
                      {trackingTx ? 'Tracking deposit...' : txTracked ? 'Redirecting...' : 'Transaction sent!'}
                    </p>
                    {hash && (
                      <a
                        href={`${explorerLink}${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-700 hover:text-green-900 font-semibold flex items-center space-x-1"
                      >
                        <span>View Transaction</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4"
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">Transaction Failed</h4>
                    <p className="text-sm text-red-800">
                      {error.message.includes('rejected') 
                        ? 'You rejected the transaction' 
                        : 'Transaction failed. Please try again.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Operator Wallet - Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Send {tokenSymbol} to:
              </label>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border-2 border-gray-200">
                <code className="flex-1 text-sm font-mono text-gray-900 break-all">
                  {activeWallet || 'Wallet not configured'}
                </code>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={copyAddress}
                  className="p-2 hover:bg-gray-200 rounded-xl transition-colors flex-shrink-0"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </motion.button>
                {selectedChain === 'arbitrum' && (
                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    href={getArbiscanAddressLink(activeWallet || '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-200 rounded-xl transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-600" />
                  </motion.a>
                )}
              </div>
            </motion.div>

            {/* Network Info - Glass Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-semibold block mb-1">Network</span>
                  <p className="text-blue-900 font-bold">{chainName}</p>
                </div>
                <div>
                  <span className="text-purple-600 font-semibold block mb-1">Token</span>
                  <p className="text-purple-900 font-bold">{tokenSymbol}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-pink-600 font-semibold block mb-1">Minimum</span>
                  <p className="text-pink-900 font-bold text-lg">{minimumDeposit} {tokenSymbol}</p>
                </div>
              </div>
            </motion.div>

            {/* Amount Input - Apple Style */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Amount ({tokenSymbol})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: ${minimumDeposit}`}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg font-semibold transition-all"
                min={minimumDeposit}
                step="0.01"
                disabled={isPending || isConfirming}
              />
            </motion.div>

            {/* Send Button - Apple Style with Gradient */}
            <motion.button
              onClick={handleSendUSDC}
              disabled={isPending || isConfirming || trackingTx || !amount}
              whileHover={{ scale: !isPending && !isConfirming ? 1.02 : 1 }}
              whileTap={{ scale: !isPending && !isConfirming ? 0.98 : 1 }}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                isPending || isConfirming || trackingTx || !amount
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-blue-500/50'
              }`}
            >
              {isPending
                ? 'Confirm in Wallet...'
                : isConfirming
                ? 'Processing...'
                : trackingTx
                ? 'Tracking...'
                : `Send ${amount || '0'} ${tokenSymbol}`}
            </motion.button>

            {/* QR Code Toggle */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 py-3 font-semibold rounded-2xl hover:bg-blue-50 transition-all"
            >
              <QrCode className="w-5 h-5" />
              <span>{showQR ? 'Hide' : 'Show'} QR Code</span>
            </motion.button>

            {showQR && activeWallet && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-center p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-inner"
              >
                <QRCodeSVG 
                  value={activeWallet} 
                  size={220}
                  level="H"
                  includeMargin
                  style={{ borderRadius: '16px' }}
                />
              </motion.div>
            )}

            {/* Manual Tracking Link */}
            <div className="border-t-2 border-gray-200 pt-6">
              <p className="text-sm text-gray-600 text-center">
                Already sent {tokenSymbol}? Track your deposit on the{' '}
                <a href="/deposits" className="text-blue-600 hover:text-blue-700 font-semibold">
                  deposits page
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
