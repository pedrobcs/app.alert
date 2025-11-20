'use client';

import { useState } from 'react';
import { X, Copy, ExternalLink, QrCode } from 'lucide-react';
import { formatAddress, getArbiscanAddressLink } from '@/lib/utils';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { ERC20_ABI, ACTIVE_USDC_ADDRESS, USDC_DECIMALS } from '@/lib/config';

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
  const [submitting, setSubmitting] = useState(false);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const copyAddress = () => {
    navigator.clipboard.writeText(operatorWallet);
    toast.success('Address copied to clipboard');
  };

  const handleSendUSDC = async () => {
    if (!amount || parseFloat(amount) < minimumDeposit) {
      toast.error(`Minimum deposit is ${minimumDeposit} ${tokenSymbol}`);
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
    if (!address) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/deposits/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash,
          userAddress: address,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to track deposit');
      }

      toast.success('Deposit tracked successfully!');
      onClose();
      // Refresh page to show new deposit
      window.location.reload();
    } catch (err) {
      console.error('Track error:', err);
      toast.error('Failed to track deposit. You can submit the transaction hash manually.');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-track when transaction is confirmed
  if (isSuccess && hash && !submitting) {
    trackTransaction(hash);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Make a Deposit</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Funds are sent directly to the operator
              wallet. Ensure you understand the risks before investing. Only invest
              what you can afford to lose.
            </p>
          </div>

          {/* Operator Wallet */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Send {tokenSymbol} to:
            </label>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-4">
              <code className="flex-1 text-sm font-mono text-gray-900 break-all">
                {operatorWallet}
              </code>
              <button
                onClick={copyAddress}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 text-gray-600" />
              </button>
              <a
                href={getArbiscanAddressLink(operatorWallet)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Network Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Network:</strong> Arbitrum One
              <br />
              <strong>Token:</strong> {tokenSymbol}
              <br />
              <strong>Minimum:</strong> {minimumDeposit} {tokenSymbol}
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount to Deposit ({tokenSymbol})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Min: ${minimumDeposit}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={minimumDeposit}
              step="0.01"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendUSDC}
            disabled={isPending || isConfirming || submitting}
            className="w-full btn btn-primary"
          >
            {isPending
              ? 'Confirm in Wallet...'
              : isConfirming
              ? 'Confirming Transaction...'
              : submitting
              ? 'Tracking Deposit...'
              : `Send ${amount || '0'} ${tokenSymbol}`}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Error: {error.message}
              </p>
            </div>
          )}

          {/* QR Code Toggle */}
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 py-2"
          >
            <QrCode className="w-5 h-5" />
            <span>{showQR ? 'Hide' : 'Show'} QR Code</span>
          </button>

          {showQR && (
            <div className="flex justify-center">
              <QRCodeSVG value={operatorWallet} size={200} />
            </div>
          )}

          {/* Manual Tracking */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Already sent {tokenSymbol}? Track your deposit by submitting the
              transaction hash on the{' '}
              <a href="/deposits" className="text-blue-600 hover:underline">
                deposits page
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
