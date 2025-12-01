// Chain and contract configuration

export const ARBITRUM_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ARBITRUM_CHAIN_ID || '42161');

export const USDC_ADDRESSES = {
  // Arbitrum Bridged USDC (USDC.e)
  BRIDGED: '0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8',
  // Arbitrum Native USDC (Circle)
  NATIVE: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
} as const;

export const ACTIVE_USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS || USDC_ADDRESSES.BRIDGED).toLowerCase();

export const USDC_DECIMALS = 6;

// ERC20 ABI for token transfers
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
] as const;

export const APP_CONFIG = {
  name: 'FuturesPilot',
  description: 'Intelligence and workflow copilot for discretionary crypto futures teams',
  minimumDeposit: parseFloat(process.env.MINIMUM_DEPOSIT_USDC || '100'),
  requiredConfirmations: parseInt(process.env.REQUIRED_CONFIRMATIONS || '5'),
};
