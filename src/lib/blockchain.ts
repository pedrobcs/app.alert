import { ethers } from 'ethers';
import { ERC20_ABI, ACTIVE_USDC_ADDRESS, USDC_DECIMALS } from './config';

// Get provider for server-side blockchain interactions
export function getProvider(): ethers.JsonRpcProvider {
  const alchemyKey = process.env.ALCHEMY_API_KEY;
  const infuraUrl = process.env.INFURA_URL;

  if (alchemyKey) {
    return new ethers.JsonRpcProvider(
      `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`
    );
  } else if (infuraUrl) {
    return new ethers.JsonRpcProvider(infuraUrl);
  } else {
    // Fallback to public RPC (not recommended for production)
    return new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
  }
}

export interface TransactionDetails {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number | null;
  confirmations: number;
  timestamp: number | null;
  status: number | null;
}

export interface TokenTransferDetails extends TransactionDetails {
  tokenAddress: string;
  tokenAmount: string;
  tokenDecimals: number;
}

// Verify a transaction on Arbitrum
export async function verifyTransaction(
  txHash: string
): Promise<TransactionDetails | null> {
  try {
    const provider = getProvider();
    const tx = await provider.getTransaction(txHash);

    if (!tx) {
      return null;
    }

    const receipt = await provider.getTransactionReceipt(txHash);
    const currentBlock = await provider.getBlockNumber();
    
    let timestamp: number | null = null;
    if (tx.blockNumber) {
      const block = await provider.getBlock(tx.blockNumber);
      timestamp = block ? block.timestamp : null;
    }

    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to || '',
      value: tx.value.toString(),
      blockNumber: tx.blockNumber,
      confirmations: tx.blockNumber ? currentBlock - tx.blockNumber : 0,
      timestamp,
      status: receipt ? receipt.status : null,
    };
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return null;
  }
}

// Verify a USDC token transfer
export async function verifyUSDCTransfer(
  txHash: string,
  expectedFrom: string,
  expectedTo: string,
  minimumAmount: number = 0
): Promise<TokenTransferDetails | null> {
  try {
    const provider = getProvider();
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt || receipt.status !== 1) {
      return null;
    }

    // Get transaction details
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return null;
    }

    // Parse Transfer event from logs
    const usdcContract = new ethers.Contract(ACTIVE_USDC_ADDRESS, ERC20_ABI, provider);
    const transferEvents = receipt.logs
      .filter((log) => log.address.toLowerCase() === ACTIVE_USDC_ADDRESS)
      .map((log) => {
        try {
          return usdcContract.interface.parseLog({
            topics: log.topics as string[],
            data: log.data,
          });
        } catch {
          return null;
        }
      })
      .filter((event) => event !== null && event.name === 'Transfer');

    if (transferEvents.length === 0) {
      return null;
    }

    // Find the relevant transfer event
    const transferEvent = transferEvents.find((event) => {
      if (!event) return false;
      const from = event.args[0] as string;
      const to = event.args[1] as string;
      return (
        from.toLowerCase() === expectedFrom.toLowerCase() &&
        to.toLowerCase() === expectedTo.toLowerCase()
      );
    });

    if (!transferEvent) {
      return null;
    }

    const amount = transferEvent.args[2] as bigint;
    const amountFormatted = parseFloat(ethers.formatUnits(amount, USDC_DECIMALS));

    // Check minimum amount
    if (minimumAmount > 0 && amountFormatted < minimumAmount) {
      return null;
    }

    const currentBlock = await provider.getBlockNumber();
    let timestamp: number | null = null;
    if (tx.blockNumber) {
      const block = await provider.getBlock(tx.blockNumber);
      timestamp = block ? block.timestamp : null;
    }

    return {
      hash: tx.hash,
      from: expectedFrom,
      to: expectedTo,
      value: tx.value.toString(),
      blockNumber: tx.blockNumber,
      confirmations: tx.blockNumber ? currentBlock - tx.blockNumber : 0,
      timestamp,
      status: receipt.status,
      tokenAddress: ACTIVE_USDC_ADDRESS,
      tokenAmount: amountFormatted.toString(),
      tokenDecimals: USDC_DECIMALS,
    };
  } catch (error) {
    console.error('Error verifying USDC transfer:', error);
    return null;
  }
}

// Get USDC balance for an address
export async function getUSDCBalance(address: string): Promise<number> {
  try {
    const provider = getProvider();
    const usdcContract = new ethers.Contract(ACTIVE_USDC_ADDRESS, ERC20_ABI, provider);
    const balance = await usdcContract.balanceOf(address);
    return parseFloat(ethers.formatUnits(balance, USDC_DECIMALS));
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    return 0;
  }
}

// Scan for recent transfers to operator wallet
export async function scanRecentTransfers(
  toAddress: string,
  fromBlock: number | 'latest',
  toBlock: number | 'latest' = 'latest'
): Promise<Array<{ from: string; amount: string; txHash: string; blockNumber: number }>> {
  try {
    const provider = getProvider();
    const usdcContract = new ethers.Contract(ACTIVE_USDC_ADDRESS, ERC20_ABI, provider);
    
    // Create filter for Transfer events to the operator address
    const filter = {
      address: ACTIVE_USDC_ADDRESS,
      topics: [
        ethers.id('Transfer(address,address,uint256)'),
        null, // from (any address)
        ethers.zeroPadValue(toAddress, 32), // to (operator address)
      ],
      fromBlock,
      toBlock,
    };

    const logs = await provider.getLogs(filter);
    
    return logs.map((log) => {
      const parsed = usdcContract.interface.parseLog({
        topics: log.topics as string[],
        data: log.data,
      });
      
      if (!parsed) {
        throw new Error('Failed to parse log');
      }

      return {
        from: parsed.args[0] as string,
        amount: ethers.formatUnits(parsed.args[2] as bigint, USDC_DECIMALS),
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      };
    });
  } catch (error) {
    console.error('Error scanning transfers:', error);
    return [];
  }
}
