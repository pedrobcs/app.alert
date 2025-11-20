import { ethers } from 'ethers';

// ERC20 ABI - only the functions we need
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

// Get provider for Arbitrum
export function getArbitrumProvider(): ethers.JsonRpcProvider {
  const alchemyKey = process.env.ALCHEMY_API_KEY;
  const infuraKey = process.env.INFURA_API_KEY;
  
  if (alchemyKey) {
    return new ethers.JsonRpcProvider(
      `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`
    );
  } else if (infuraKey) {
    return new ethers.JsonRpcProvider(
      `https://arbitrum-mainnet.infura.io/v3/${infuraKey}`
    );
  } else {
    // Fallback to public RPC (not recommended for production)
    return new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
  }
}

// Verify a transaction and extract deposit details
export async function verifyDepositTransaction(
  txHash: string,
  expectedRecipient: string,
  expectedTokenAddress: string
): Promise<{
  valid: boolean;
  amount?: string;
  from?: string;
  to?: string;
  blockNumber?: number;
  timestamp?: number;
  confirmations?: number;
  error?: string;
}> {
  try {
    const provider = getArbitrumProvider();
    
    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      return { valid: false, error: 'Transaction not found' };
    }
    
    // Get transaction details
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return { valid: false, error: 'Transaction details not found' };
    }
    
    // Check if transaction is confirmed
    const currentBlock = await provider.getBlockNumber();
    const confirmations = currentBlock - receipt.blockNumber;
    
    // Get block timestamp
    const block = await provider.getBlock(receipt.blockNumber);
    const timestamp = block?.timestamp || 0;
    
    // Verify it's an ERC20 transfer
    const tokenContract = new ethers.Contract(
      expectedTokenAddress,
      ERC20_ABI,
      provider
    );
    
    // Parse Transfer events from logs
    const transferEvents = receipt.logs
      .filter((log) => log.address.toLowerCase() === expectedTokenAddress.toLowerCase())
      .map((log) => {
        try {
          return tokenContract.interface.parseLog({
            topics: log.topics as string[],
            data: log.data,
          });
        } catch {
          return null;
        }
      })
      .filter((event) => event !== null && event.name === 'Transfer');
    
    if (transferEvents.length === 0) {
      return { valid: false, error: 'No Transfer event found in transaction' };
    }
    
    // Find the transfer to the expected recipient
    const relevantTransfer = transferEvents.find(
      (event) =>
        event &&
        event.args &&
        event.args.to.toLowerCase() === expectedRecipient.toLowerCase()
    );
    
    if (!relevantTransfer || !relevantTransfer.args) {
      return {
        valid: false,
        error: `Transaction does not transfer tokens to ${expectedRecipient}`,
      };
    }
    
    // Get decimals for proper amount formatting
    const decimals = await tokenContract.decimals();
    const amount = ethers.formatUnits(relevantTransfer.args.value, decimals);
    
    return {
      valid: true,
      amount,
      from: relevantTransfer.args.from,
      to: relevantTransfer.args.to,
      blockNumber: receipt.blockNumber,
      timestamp,
      confirmations,
    };
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Scan blocks for incoming transfers to an address
export async function scanBlocksForTransfers(
  tokenAddress: string,
  recipientAddress: string,
  fromBlock: number,
  toBlock: number | 'latest' = 'latest'
): Promise<Array<{
  txHash: string;
  from: string;
  to: string;
  amount: string;
  blockNumber: number;
  timestamp: number;
}>> {
  try {
    const provider = getArbitrumProvider();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );
    
    // Get Transfer events
    const filter = tokenContract.filters.Transfer(null, recipientAddress);
    const events = await tokenContract.queryFilter(filter, fromBlock, toBlock);
    
    // Get decimals
    const decimals = await tokenContract.decimals();
    
    // Process events
    const transfers = await Promise.all(
      events.map(async (event) => {
        const block = await event.getBlock();
        return {
          txHash: event.transactionHash,
          from: event.args.from,
          to: event.args.to,
          amount: ethers.formatUnits(event.args.value, decimals),
          blockNumber: event.blockNumber,
          timestamp: block.timestamp,
        };
      })
    );
    
    return transfers;
  } catch (error) {
    console.error('Error scanning blocks:', error);
    return [];
  }
}

// Get current block number
export async function getCurrentBlockNumber(): Promise<number> {
  try {
    const provider = getArbitrumProvider();
    return await provider.getBlockNumber();
  } catch (error) {
    console.error('Error getting block number:', error);
    return 0;
  }
}

// Format USDC amount (6 decimals typically)
export function formatUSDC(amount: string | number, decimals: number = 6): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Parse USDC amount to base units
export function parseUSDC(amount: string | number, decimals: number = 6): string {
  return ethers.parseUnits(amount.toString(), decimals).toString();
}
