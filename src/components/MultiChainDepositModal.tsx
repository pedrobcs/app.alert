'use client';

import { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, QrCode, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';
import { getArbiscanAddressLink } from '@/lib/utils';
import { getSolanaAddressExplorerLink } from '@/lib/solana';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { parseUnits } from 'viem';
import { ERC20_ABI, ACTIVE_USDC_ADDRESS, USDC_DECIMALS } from '@/lib/config';
import { SOLANA_USDC_MINT, SOLANA_USDC_DECIMALS } from '@/lib/solana';
import { motion, AnimatePresence } from 'framer-motion';
import { ChainSelector, Chain } from './ChainSelector';

interface MultiChainDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorWallet: string;
  solanaOperatorWallet: string;
  tokenSymbol: string;
  minimumDeposit: number;
}

export function MultiChainDepositModal({
  isOpen,
  onClose,
  operatorWallet,
  solanaOperatorWallet,
  tokenSymbol,
  minimumDeposit,
}: MultiChainDepositModalProps) {
  const [selectedChain, setSelectedChain] = useState<Chain>('arbitrum');
  const [amount, setAmount] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [trackingTx, setTrackingTx] = useState(false);
  const [txTracked, setTxTracked] = useState(false);

  // Arbitrum (EVM) wallet
  const { address: evmAddress } = useAccount();
  const { writeContract, data: evmHash, error: evmError, isPending: evmPending, reset: evmReset } = useWriteContract();
  const { isLoading: evmConfirming, isSuccess: evmSuccess } = useWaitForTransactionReceipt({
    hash: evmHash,
  });

  // Solana wallet
  const { publicKey: solanaPublicKey, sendTransaction: sendSolanaTransaction } = useSolanaWallet();
  const { connection: solanaConnection } = useConnection();
  const [solanaTx, setSolanaTx] = useState<string | null>(null);
  const [solanaPending, setSolanaPending] = useState(false);
  const [solanaSuccess, setSolanaSuccess] = useState(false);
  const [solanaError, setSolanaError] = useState<Error | null>(null);

  const currentWallet = selectedChain === 'arbitrum' ? operatorWallet : solanaOperatorWallet;
  const currentAddress = selectedChain === 'arbitrum' ? evmAddress : solanaPublicKey?.toBase58();

  const copyAddress = () => {
    navigator.clipboard.writeText(currentWallet);
    toast.success('Address copied!', {
      icon: '📋',
      style: {
        borderRadius: '12px',
        background: '#10b981',
        color: '#fff',
      },
    });
  };

  const handleSendUSDC = async () => {
    if (!amount || parseFloat(amount) < minimumDeposit) {
      toast.error(`Minimum deposit is ${minimumDeposit} ${tokenSymbol}`, {
        icon: '⚠️',
        style: {
          borderRadius: '12px',
        },
      });
      return;
    }

    if (selectedChain === 'arbitrum') {
      await handleArbitrumTransfer();
    } else {
      await handleSolanaTransfer();
    }
  };

  const handleArbitrumTransfer = async () => {
    if (!evmAddress) {
      toast.error('Please connect your Ethereum wallet');
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

  const handleSolanaTransfer = async () => {
    if (!solanaPublicKey) {
      toast.error('Please connect your Solana wallet');
      return;
    }

    try {
      setSolanaPending(true);
      setSolanaError(null);

      const operatorPublicKey = new PublicKey(solanaOperatorWallet);
      
      // Get token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(
        SOLANA_USDC_MINT,
        solanaPublicKey
      );
      
      const toTokenAccount = await getAssociatedTokenAddress(
        SOLANA_USDC_MINT,
        operatorPublicKey
      );

      // Create transfer instruction
      const transferAmount = Math.floor(parseFloat(amount) * Math.pow(10, SOLANA_USDC_DECIMALS));
      
      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          solanaPublicKey,
          transferAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Get recent blockhash
      const { blockhash } = await solanaConnection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = solanaPublicKey;

      // Send transaction
      const signature = await sendSolanaTransaction(transaction, solanaConnection);
      
      toast.loading('Confirming transaction...', { id: 'sol-tx' });
      
      // Wait for confirmation
      await solanaConnection.confirmTransaction(signature, 'confirmed');
      
      setSolanaTx(signature);
      setSolanaSuccess(true);
      toast.success('Transaction confirmed!', { id: 'sol-tx' });
    } catch (err: any) {
      console.error('Solana transfer error:', err);
      setSolanaError(err);
      toast.error(err.message || 'Failed to send transaction');
    } finally {
      setSolanaPending(false);
    }
  };

  // Track transaction when it's confirmed
  const trackTransaction = async (txHash: string, chain: Chain) => {
    if (!currentAddress || trackingTx || txTracked) return;

    try {
      setTrackingTx(true);
      
      toast.loading('Tracking your deposit...', { id: 'tracking' });

      const res = await fetch('/api/deposits/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash,
          userAddress: currentAddress,
          chain,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to track deposit');
      }

      toast.success('Deposit tracked successfully!', { 
        id: 'tracking',
        icon: '✅',
      });
      setTxTracked(true);
      
      // Redirect to deposits page after a short delay
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

  // Auto-track when transaction is confirmed
  useEffect(() => {
    if (evmSuccess && evmHash && !trackingTx && !txTracked) {
      trackTransaction(evmHash, 'arbitrum');
    }
  }, [evmSuccess, evmHash]);

  useEffect(() => {
    if (solanaSuccess && solanaTx && !trackingTx && !txTracked) {
      trackTransaction(solanaTx, 'solana');
    }
  }, [solanaSuccess, solanaTx]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setShowQR(false);
      setTrackingTx(false);
      setTxTracked(false);
      setSolanaTx(null);
      setSolanaSuccess(false);
      setSolanaError(null);
      evmReset();
    }
  }, [isOpen, evmReset]);

  if (!isOpen) return null;

  const isSuccess = selectedChain === 'arbitrum' ? evmSuccess : solanaSuccess;
  const isPending = selectedChain === 'arbitrum' ? evmPending : solanaPending;
  const isConfirming = selectedChain === 'arbitrum' ? evmConfirming : solanaPending;
  const error = selectedChain === 'arbitrum' ? evmError : solanaError;
  const txHash = selectedChain === 'arbitrum' ? evmHash : solanaTx;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Header - Premium Apple Style */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-5 flex items-center justify-between rounded-t-3xl sm:rounded-t-3xl z-10">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Wallet className="w-6 h-6" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">Make a Deposit</h2>
                <p className="text-xs text-white/80">Multi-chain USDC deposit</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="p-6 space-y-6">
            {/* Chain Selector */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ChainSelector selectedChain={selectedChain} onSelectChain={setSelectedChain} />
            </motion.div>

            {/* Warning - iOS Style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-4"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <strong className="font-semibold">Important:</strong> Only invest what you can afford to lose. Funds are sent directly to the operator wallet.
                </div>
              </div>
            </motion.div>

            {/* Transaction Success */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-4"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-green-900 mb-1">Success!</h4>
                    <p className="text-sm text-green-800 mb-2">
                      {trackingTx ? 'Tracking your deposit...' : txTracked ? 'Redirecting...' : 'Transaction confirmed!'}
                    </p>
                    {txHash && (
                      <a
                        href={
                          selectedChain === 'arbitrum'
                            ? `https://arbiscan.io/tx/${txHash}`
                            : `https://solscan.io/tx/${txHash}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-700 hover:text-green-900 font-semibold flex items-center space-x-1"
                      >
                        <span>View Explorer</span>
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
                className="bg-gradient-to-br from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl p-4"
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">Transaction Failed</h4>
                    <p className="text-sm text-red-800">
                      {error.message.includes('rejected') || error.message.includes('User rejected')
                        ? 'You cancelled the transaction' 
                        : 'Transaction failed. Please try again.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Operator Wallet - Apple Card Style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Send {tokenSymbol} to:
              </label>
              <div className="flex items-center space-x-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm">
                <code className="flex-1 text-xs sm:text-sm font-mono text-gray-900 break-all">
                  {currentWallet}
                </code>
                <motion.button
                  onClick={copyAddress}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0 shadow-sm"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </motion.button>
                <motion.a
                  href={
                    selectedChain === 'arbitrum'
                      ? getArbiscanAddressLink(currentWallet)
                      : getSolanaAddressExplorerLink(currentWallet)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0 shadow-sm"
                >
                  <ExternalLink className="w-5 h-5 text-gray-600" />
                </motion.a>
              </div>
            </div>

            {/* Network Info - iOS Cards Style */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-blue-600 font-semibold">Network:</span>
                  <p className="text-blue-900 font-bold capitalize">{selectedChain}</p>
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

            {/* Amount Input - Premium iOS Style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount ({tokenSymbol})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: ${minimumDeposit}`}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg font-semibold transition-all"
                min={minimumDeposit}
                step="0.01"
                disabled={isPending || isConfirming}
              />
            </div>

            {/* Send Button - Apple Style */}
            <motion.button
              onClick={handleSendUSDC}
              disabled={isPending || isConfirming || trackingTx || !amount || !currentAddress}
              whileHover={{ scale: !isPending && !isConfirming ? 1.02 : 1 }}
              whileTap={{ scale: !isPending && !isConfirming ? 0.98 : 1 }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                isPending || isConfirming || trackingTx || !amount || !currentAddress
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-500/50'
              }`}
            >
              {!currentAddress
                ? 'Connect Wallet First'
                : isPending
                ? 'Confirm in Wallet...'
                : isConfirming
                ? 'Processing...'
                : trackingTx
                ? 'Tracking...'
                : `Send ${amount || '0'} ${tokenSymbol}`}
            </motion.button>

            {/* QR Code Toggle */}
            <motion.button
              onClick={() => setShowQR(!showQR)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 py-3 font-semibold bg-blue-50 rounded-xl transition-colors"
            >
              <QrCode className="w-5 h-5" />
              <span>{showQR ? 'Hide' : 'Show'} QR Code</span>
            </motion.button>

            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-center p-6 bg-white rounded-xl border-2 border-gray-200 shadow-inner"
              >
                <QRCodeSVG 
                  value={currentWallet} 
                  size={Math.min(window.innerWidth - 100, 220)}
                  level="H"
                  includeMargin
                />
              </motion.div>
            )}
          </div>

          {/* Bottom safe area for mobile */}
          <div className="h-4 sm:h-0" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
