'use client';

import { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { getArbiscanAddressLink } from '@/lib/utils';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { ERC20_ABI, ACTIVE_USDC_ADDRESS, USDC_DECIMALS } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorWallet: string;
  tokenSymbol: string;
  minimumDeposit: number;
}

export function DepositModal({
  isOpen,
  onClose,
  operatorWallet,
  tokenSymbol,
  minimumDeposit,
}: DepositModalProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [trackingTx, setTrackingTx] = useState(false);
  const [txTracked, setTxTracked] = useState(false);

  const { writeContract, data: hash, error, isPending, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const copyAddress = () => {
    navigator.clipboard.writeText(operatorWallet);
    toast.success('Address copied to clipboard!');
  };

  const handleSendUSDC = async () => {
    if (!amount || parseFloat(amount) < minimumDeposit) {
      toast.error(`Minimum deposit is ${minimumDeposit} ${tokenSymbol}`);
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet');
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

  // Track transaction when it's confirmed
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to track deposit');
      }

      toast.success('Deposit tracked successfully!', { id: 'tracking' });
      setTxTracked(true);
      
      // Redirect to deposits page after a short delay
      setTimeout(() => {
        window.location.href = '/deposits';
      }, 2000);
    } catch (err: any) {
      console.error('Track error:', err);
      toast.error(err.message || 'Failed to track deposit', { id: 'tracking' });
      
      // Still close modal but show manual tracking option
      setTimeout(() => {
        onClose();
      }, 3000);
    } finally {
      setTrackingTx(false);
    }
  };

  // Auto-track when transaction is confirmed
  useEffect(() => {
    if (isSuccess && hash && !trackingTx && !txTracked) {
      trackTransaction(hash);
    }
  }, [isSuccess, hash]);

  // Reset state when modal closes
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <span>Make a Deposit</span>
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Warning */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <strong>Important:</strong> Funds are sent directly to the operator
                  wallet. Ensure you understand the risks before investing. Only invest
                  what you can afford to lose.
                </div>
              </div>
            </motion.div>

            {/* Transaction Success */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-2 border-green-200 rounded-xl p-4"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-green-900 mb-1">Transaction Successful!</h4>
                    <p className="text-sm text-green-800 mb-2">
                      {trackingTx ? 'Tracking your deposit...' : txTracked ? 'Deposit tracked! Redirecting...' : 'Your USDC has been sent.'}
                    </p>
                    {hash && (
                      <a
                        href={`https://arbiscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-700 hover:text-green-900 font-semibold flex items-center space-x-1"
                      >
                        <span>View on Arbiscan</span>
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
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

            {/* Operator Wallet */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Send {tokenSymbol} to:
              </label>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-4 border-2 border-gray-200">
                <code className="flex-1 text-sm font-mono text-gray-900 break-all">
                  {operatorWallet}
                </code>
                <button
                  onClick={copyAddress}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
                <a
                  href={getArbiscanAddressLink(operatorWallet)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-5 h-5 text-gray-600" />
                </a>
              </div>
            </div>

            {/* Network Info */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-blue-600 font-semibold">Network:</span>
                  <p className="text-blue-900 font-bold">Arbitrum One</p>
                </div>
                <div>
                  <span className="text-blue-600 font-semibold">Token:</span>
                  <p className="text-blue-900 font-bold">{tokenSymbol}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-blue-600 font-semibold">Minimum:</span>
                  <p className="text-blue-900 font-bold">{minimumDeposit} {tokenSymbol}</p>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Amount to Deposit ({tokenSymbol})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: ${minimumDeposit}`}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                min={minimumDeposit}
                step="0.01"
                disabled={isPending || isConfirming}
              />
            </div>

            {/* Send Button */}
            <motion.button
              onClick={handleSendUSDC}
              disabled={isPending || isConfirming || trackingTx || !amount}
              whileHover={{ scale: !isPending && !isConfirming ? 1.02 : 1 }}
              whileTap={{ scale: !isPending && !isConfirming ? 0.98 : 1 }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                isPending || isConfirming || trackingTx || !amount
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-blue-500/50'
              }`}
            >
              {isPending
                ? 'Confirm in Wallet...'
                : isConfirming
                ? 'Processing Transaction...'
                : trackingTx
                ? 'Tracking Deposit...'
                : `Send ${amount || '0'} ${tokenSymbol}`}
            </motion.button>

            {/* QR Code Toggle */}
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 py-2 font-semibold"
            >
              <QrCode className="w-5 h-5" />
              <span>{showQR ? 'Hide' : 'Show'} QR Code</span>
            </button>

            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-center p-4 bg-white rounded-xl border-2 border-gray-200"
              >
                <QRCodeSVG 
                  value={operatorWallet} 
                  size={220}
                  level="H"
                  includeMargin
                />
              </motion.div>
            )}

            {/* Manual Tracking */}
            <div className="border-t-2 border-gray-200 pt-6">
              <p className="text-sm text-gray-600 text-center">
                Already sent {tokenSymbol}? Track your deposit by submitting the
                transaction hash on the{' '}
                <a href="/deposits" className="text-blue-600 hover:text-blue-700 font-semibold">
                  deposits page
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
