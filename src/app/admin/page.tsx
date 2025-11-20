'use client';

import { useState, useEffect } from 'react';
import { formatUSDC } from '@/lib/blockchain';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if already authenticated
    const adminToken = document.cookie.includes('admin-token');
    if (adminToken) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);
  
  const handleLogin = () => {
    // Simple password check (in production, use proper authentication)
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      document.cookie = 'admin-token=authenticated; path=/; max-age=86400';
      setIsAuthenticated(true);
      fetchData();
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid password');
    }
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, settingsRes, depositsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/deposits'),
      ]);
      
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
      
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data.settings);
      }
      
      if (depositsRes.ok) {
        const data = await depositsRes.json();
        setDeposits(data.deposits);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        toast.success('Settings updated successfully');
        fetchData();
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-arbitrum focus:outline-none mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full px-6 py-3 bg-arbitrum hover:bg-arbitrum-dark rounded-lg font-semibold transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  
  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="glass rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Total Invested</p>
              <p className="text-3xl font-bold">${formatUSDC(parseFloat(stats.totalInvestedAmount))}</p>
            </div>
            <div className="glass rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Total Deposits</p>
              <p className="text-3xl font-bold">${formatUSDC(parseFloat(stats.totalDepositsAmount))}</p>
            </div>
            <div className="glass rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Pending Deposits</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.pendingDepositsCount}</p>
            </div>
          </div>
        )}
        
        {/* Settings */}
        {settings && (
          <div className="glass rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Receiving Wallet Address</label>
                  <input
                    type="text"
                    value={settings.receivingWalletAddress || ''}
                    onChange={(e) => setSettings({ ...settings, receivingWalletAddress: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-arbitrum focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">USDC Token Address</label>
                  <input
                    type="text"
                    value={settings.usdcTokenAddress || ''}
                    onChange={(e) => setSettings({ ...settings, usdcTokenAddress: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-arbitrum focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Deposit (USDC)</label>
                  <input
                    type="number"
                    value={settings.minimumDeposit || ''}
                    onChange={(e) => setSettings({ ...settings, minimumDeposit: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-arbitrum focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Required Confirmations</label>
                  <input
                    type="number"
                    value={settings.requiredConfirmations || 5}
                    onChange={(e) => setSettings({ ...settings, requiredConfirmations: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-arbitrum focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Current NAV</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={settings.currentNav || ''}
                    onChange={(e) => setSettings({ ...settings, currentNav: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-arbitrum focus:outline-none"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.kycRequired || false}
                      onChange={(e) => setSettings({ ...settings, kycRequired: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">KYC Required</span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-arbitrum hover:bg-arbitrum-dark rounded-lg font-semibold transition-colors"
              >
                Update Settings
              </button>
            </form>
          </div>
        )}
        
        {/* Recent Deposits */}
        <div className="glass rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Deposits</h2>
            <button
              onClick={fetchData}
              className="text-sm text-arbitrum hover:underline"
            >
              Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Tx Hash</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b border-gray-800">
                    <td className="py-3">
                      <p className="text-sm">{deposit.user.walletAddress.slice(0, 10)}...</p>
                    </td>
                    <td className="py-3 font-semibold">
                      ${formatUSDC(parseFloat(deposit.amount))}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        deposit.status === 'CREDITED' ? 'bg-green-500/20 text-green-500' :
                        deposit.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <a
                        href={`https://arbiscan.io/tx/${deposit.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-arbitrum hover:underline text-sm"
                      >
                        {deposit.txHash.slice(0, 10)}...
                      </a>
                    </td>
                    <td className="py-3 text-sm text-gray-400">
                      {new Date(deposit.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
