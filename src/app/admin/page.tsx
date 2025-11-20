'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { formatUSDC, formatDate } from '@/lib/utils';
import { Settings, Users, DollarSign, TrendingUp, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState({
    operatorWalletAddress: '',
    acceptedTokenAddress: '',
    tokenSymbol: 'USDC',
    minimumDeposit: 100,
    requiredConfirmations: 5,
    currentNAV: 1.0,
    totalAUM: 0,
    enableKYC: false,
    enableDeposits: true,
    enableWithdrawals: false,
    performanceYTD: 0,
  });

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    checkAdminAccess();
  }, [isConnected, address]);

  const checkAdminAccess = async () => {
    try {
      // Check if user is admin
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS?.toLowerCase();
      if (adminAddress !== address?.toLowerCase()) {
        toast.error('Access denied: Admin only');
        router.push('/dashboard');
        return;
      }

      setIsAdmin(true);
      await Promise.all([fetchSettings(), fetchDeposits(), fetchStats()]);
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast.error('Access denied');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/admin/deposits');
      if (res.ok) {
        const data = await res.json();
        setDeposits(data.deposits || []);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to save settings');

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!isConnected || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage platform settings and monitor deposits
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalUsers || 0}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {formatUSDC(stats.totalDeposits || 0)}
              </div>
              <div className="text-sm text-gray-600">Total Deposits</div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.pendingDeposits || 0}
              </div>
              <div className="text-sm text-gray-600">Pending Deposits</div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {formatUSDC(settings.totalAUM)}
              </div>
              <div className="text-sm text-gray-600">Total AUM</div>
            </div>
          </div>
        )}

        {/* Settings Form */}
        <div className="card mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Platform Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Operator Wallet Address
              </label>
              <input
                type="text"
                value={settings.operatorWalletAddress}
                onChange={(e) =>
                  setSettings({ ...settings, operatorWalletAddress: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Accepted Token Address
              </label>
              <input
                type="text"
                value={settings.acceptedTokenAddress}
                onChange={(e) =>
                  setSettings({ ...settings, acceptedTokenAddress: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Token Symbol
              </label>
              <input
                type="text"
                value={settings.tokenSymbol}
                onChange={(e) =>
                  setSettings({ ...settings, tokenSymbol: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Deposit
              </label>
              <input
                type="number"
                value={settings.minimumDeposit}
                onChange={(e) =>
                  setSettings({ ...settings, minimumDeposit: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Required Confirmations
              </label>
              <input
                type="number"
                value={settings.requiredConfirmations}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requiredConfirmations: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current NAV
              </label>
              <input
                type="number"
                step="0.0001"
                value={settings.currentNAV}
                onChange={(e) =>
                  setSettings({ ...settings, currentNAV: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Performance YTD (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.performanceYTD}
                onChange={(e) =>
                  setSettings({ ...settings, performanceYTD: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total AUM
              </label>
              <input
                type="number"
                value={settings.totalAUM}
                onChange={(e) =>
                  setSettings({ ...settings, totalAUM: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enableKYC}
                onChange={(e) =>
                  setSettings({ ...settings, enableKYC: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Enable KYC Requirement</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enableDeposits}
                onChange={(e) =>
                  setSettings({ ...settings, enableDeposits: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Enable Deposits</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enableWithdrawals}
                onChange={(e) =>
                  setSettings({ ...settings, enableWithdrawals: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Enable Withdrawals</span>
            </label>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="mt-6 btn btn-primary flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {/* Recent Deposits */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Deposits
          </h2>

          {deposits.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No deposits yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      TX Hash
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit: any) => (
                    <tr key={deposit.id} className="border-b border-gray-100">
                      <td className="py-4 px-4 text-sm font-mono text-gray-900">
                        {deposit.user?.walletAddress?.substring(0, 10)}...
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {formatDate(deposit.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                        {formatUSDC(deposit.amount)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            deposit.status === 'CREDITED'
                              ? 'bg-green-100 text-green-800'
                              : deposit.status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {deposit.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <a
                          href={`https://arbiscan.io/tx/${deposit.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm font-mono"
                        >
                          {deposit.txHash.substring(0, 10)}...
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
