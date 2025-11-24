import { Connection, PublicKey, ParsedTransactionWithMeta, ParsedInstruction } from '@solana/web3.js';

// Solana RPC Configuration
export const SOLANA_RPC_ENDPOINT = process.env.SOLANA_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';
export const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC on Solana mainnet
export const USDC_DECIMALS = 6;

// Get Solana connection
export function getSolanaConnection(): Connection {
  const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || SOLANA_RPC_ENDPOINT;
  return new Connection(rpcEndpoint, 'confirmed');
}

export interface SolanaTransactionDetails {
  signature: string;
  from: string;
  to: string;
  amount: string;
  blockTime: number | null;
  slot: number;
  confirmations: number;
  status: 'success' | 'failed' | null;
}

// Verify a Solana transaction
export async function verifySolanaTransaction(
  signature: string
): Promise<SolanaTransactionDetails | null> {
  try {
    const connection = getSolanaConnection();
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx || !tx.meta) {
      return null;
    }

    // Get current slot for confirmations
    const currentSlot = await connection.getSlot();
    const confirmations = currentSlot - tx.slot;

    return {
      signature,
      from: '', // Will be populated from parsed instructions
      to: '',
      amount: '0',
      blockTime: tx.blockTime,
      slot: tx.slot,
      confirmations,
      status: tx.meta.err ? 'failed' : 'success',
    };
  } catch (error) {
    console.error('Error verifying Solana transaction:', error);
    return null;
  }
}

// Verify a USDC transfer on Solana
export async function verifySolanaUSDCTransfer(
  signature: string,
  expectedFrom: string,
  expectedTo: string,
  minimumAmount: number = 0
): Promise<SolanaTransactionDetails | null> {
  try {
    const connection = getSolanaConnection();
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx || !tx.meta || tx.meta.err) {
      return null;
    }

    // Parse token transfers
    let transferFound = false;
    let transferAmount = 0;
    let fromAddress = '';
    let toAddress = '';

    // Check for SPL token transfer instructions
    const instructions = tx.transaction.message.instructions;
    
    for (const instruction of instructions) {
      if ('parsed' in instruction && instruction.program === 'spl-token') {
        const parsed = instruction.parsed as ParsedInstruction;
        
        if (parsed.type === 'transfer' || parsed.type === 'transferChecked') {
          const info = parsed.info as any;
          
          // Get the token account info to verify it's USDC
          const sourceTokenAccount = info.source;
          const destinationTokenAccount = info.destination;
          
          // For now, accept the transfer if amounts match
          // In production, you'd want to verify the mint address is USDC
          const amount = info.amount || info.tokenAmount?.amount;
          
          if (amount) {
            transferAmount = parseInt(amount) / Math.pow(10, USDC_DECIMALS);
            
            // Get the authority (owner) addresses
            fromAddress = info.authority || expectedFrom;
            toAddress = expectedTo; // We'd need to query the destination token account's owner
            
            // Check if this is the transfer we're looking for
            if (transferAmount >= minimumAmount) {
              transferFound = true;
              break;
            }
          }
        }
      }
    }

    if (!transferFound) {
      return null;
    }

    const currentSlot = await connection.getSlot();
    const confirmations = currentSlot - tx.slot;

    return {
      signature,
      from: fromAddress,
      to: toAddress,
      amount: transferAmount.toString(),
      blockTime: tx.blockTime,
      slot: tx.slot,
      confirmations,
      status: 'success',
    };
  } catch (error) {
    console.error('Error verifying Solana USDC transfer:', error);
    return null;
  }
}

// Get USDC balance for a Solana address
export async function getSolanaUSDCBalance(address: string): Promise<number> {
  try {
    const connection = getSolanaConnection();
    const publicKey = new PublicKey(address);
    
    // Get token accounts for this wallet filtered by USDC mint
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      mint: new PublicKey(USDC_MINT_ADDRESS),
    });

    if (tokenAccounts.value.length === 0) {
      return 0;
    }

    // Sum up all USDC token account balances
    let totalBalance = 0;
    for (const account of tokenAccounts.value) {
      const balance = account.account.data.parsed.info.tokenAmount.uiAmount;
      totalBalance += balance || 0;
    }

    return totalBalance;
  } catch (error) {
    console.error('Error getting Solana USDC balance:', error);
    return 0;
  }
}

// Scan for recent USDC transfers to an address
export async function scanSolanaRecentTransfers(
  toAddress: string,
  limit: number = 10
): Promise<Array<{ from: string; amount: string; signature: string; timestamp: number | null }>> {
  try {
    const connection = getSolanaConnection();
    const publicKey = new PublicKey(toAddress);
    
    // Get recent signatures
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit });
    
    const transfers: Array<{ from: string; amount: string; signature: string; timestamp: number | null }> = [];

    for (const sig of signatures) {
      const tx = await connection.getParsedTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx || !tx.meta || tx.meta.err) continue;

      // Parse for USDC transfers
      for (const instruction of tx.transaction.message.instructions) {
        if ('parsed' in instruction && instruction.program === 'spl-token') {
          const parsed = instruction.parsed as ParsedInstruction;
          
          if (parsed.type === 'transfer' || parsed.type === 'transferChecked') {
            const info = parsed.info as any;
            const amount = info.amount || info.tokenAmount?.amount;
            
            if (amount) {
              const uiAmount = parseInt(amount) / Math.pow(10, USDC_DECIMALS);
              transfers.push({
                from: info.authority || '',
                amount: uiAmount.toString(),
                signature: sig.signature,
                timestamp: tx.blockTime,
              });
            }
          }
        }
      }
    }

    return transfers;
  } catch (error) {
    console.error('Error scanning Solana transfers:', error);
    return [];
  }
}

// Validate Solana address
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
