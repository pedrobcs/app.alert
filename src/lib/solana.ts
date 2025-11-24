import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Solana RPC endpoint
export function getSolanaConnection(): Connection {
  const rpcUrl = process.env.SOLANA_RPC_URL || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.org';
  return new Connection(rpcUrl, 'confirmed');
}

// USDC token address on Solana mainnet
export const SOLANA_USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
export const SOLANA_USDC_DECIMALS = 6;

export interface SolanaTransactionDetails {
  signature: string;
  from: string;
  to: string;
  amount: string;
  blockTime: number | null;
  confirmations: number;
  status: 'success' | 'failed' | 'pending';
}

export interface SolanaTokenTransferDetails extends SolanaTransactionDetails {
  tokenMint: string;
  tokenAmount: string;
  tokenDecimals: number;
}

/**
 * Verify a Solana transaction
 */
export async function verifySolanaTransaction(
  signature: string
): Promise<SolanaTransactionDetails | null> {
  try {
    const connection = getSolanaConnection();
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      return null;
    }

    const from = tx.transaction.message.getAccountKeys().get(0)?.toBase58() || '';
    const to = tx.transaction.message.getAccountKeys().get(1)?.toBase58() || '';

    return {
      signature,
      from,
      to,
      amount: (tx.meta?.postBalances[1] || 0 - tx.meta?.preBalances[1] || 0).toString(),
      blockTime: tx.blockTime,
      confirmations: tx.slot ? await getConfirmations(connection, tx.slot) : 0,
      status: tx.meta?.err ? 'failed' : 'success',
    };
  } catch (error) {
    console.error('Error verifying Solana transaction:', error);
    return null;
  }
}

/**
 * Verify a USDC token transfer on Solana
 */
export async function verifySolanaUSDCTransfer(
  signature: string,
  expectedFrom: string,
  expectedTo: string,
  minimumAmount: number = 0
): Promise<SolanaTokenTransferDetails | null> {
  try {
    const connection = getSolanaConnection();
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx || tx.meta?.err) {
      return null;
    }

    // Parse token transfers from the transaction
    const preTokenBalances = tx.meta?.preTokenBalances || [];
    const postTokenBalances = tx.meta?.postTokenBalances || [];

    // Find USDC transfer
    let transferAmount = 0;
    let fromAddress = '';
    let toAddress = '';

    for (const post of postTokenBalances) {
      if (post.mint === SOLANA_USDC_MINT.toBase58()) {
        const pre = preTokenBalances.find(
          (p) => p.accountIndex === post.accountIndex
        );

        if (pre && post.uiTokenAmount.uiAmount && pre.uiTokenAmount.uiAmount) {
          const diff = post.uiTokenAmount.uiAmount - pre.uiTokenAmount.uiAmount;
          
          if (diff > 0) {
            // This account received tokens
            transferAmount = diff;
            toAddress = post.owner || '';
          } else if (diff < 0) {
            // This account sent tokens
            fromAddress = pre.owner || '';
          }
        }
      }
    }

    // Verify the transfer matches expected parameters
    if (
      fromAddress.toLowerCase() !== expectedFrom.toLowerCase() ||
      toAddress.toLowerCase() !== expectedTo.toLowerCase()
    ) {
      return null;
    }

    if (minimumAmount > 0 && transferAmount < minimumAmount) {
      return null;
    }

    const confirmations = tx.slot ? await getConfirmations(connection, tx.slot) : 0;

    return {
      signature,
      from: fromAddress,
      to: toAddress,
      amount: '0', // SOL amount (not relevant for token transfer)
      blockTime: tx.blockTime,
      confirmations,
      status: 'success',
      tokenMint: SOLANA_USDC_MINT.toBase58(),
      tokenAmount: transferAmount.toString(),
      tokenDecimals: SOLANA_USDC_DECIMALS,
    };
  } catch (error) {
    console.error('Error verifying Solana USDC transfer:', error);
    return null;
  }
}

/**
 * Get USDC balance for a Solana wallet
 */
export async function getSolanaUSDCBalance(address: string): Promise<number> {
  try {
    const connection = getSolanaConnection();
    const publicKey = new PublicKey(address);
    
    // Get the associated token account for USDC
    const tokenAccount = await getAssociatedTokenAddress(
      SOLANA_USDC_MINT,
      publicKey
    );

    const balance = await connection.getTokenAccountBalance(tokenAccount);
    return balance.value.uiAmount || 0;
  } catch (error) {
    console.error('Error getting Solana USDC balance:', error);
    return 0;
  }
}

/**
 * Get number of confirmations for a transaction
 */
async function getConfirmations(
  connection: Connection,
  slot: number
): Promise<number> {
  try {
    const currentSlot = await connection.getSlot();
    return Math.max(0, currentSlot - slot);
  } catch (error) {
    console.error('Error getting confirmations:', error);
    return 0;
  }
}

/**
 * Scan for recent USDC transfers to a specific address
 */
export async function scanRecentSolanaTransfers(
  toAddress: string,
  limit: number = 10
): Promise<Array<{ from: string; amount: string; signature: string; blockTime: number | null }>> {
  try {
    const connection = getSolanaConnection();
    const publicKey = new PublicKey(toAddress);
    
    // Get the associated token account for USDC
    const tokenAccount = await getAssociatedTokenAddress(
      SOLANA_USDC_MINT,
      publicKey
    );

    const signatures = await connection.getSignaturesForAddress(tokenAccount, {
      limit,
    });

    const transfers = [];

    for (const sig of signatures) {
      const tx = await connection.getTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (tx && !tx.meta?.err) {
        const postTokenBalances = tx.meta?.postTokenBalances || [];
        const preTokenBalances = tx.meta?.preTokenBalances || [];

        for (const post of postTokenBalances) {
          if (post.mint === SOLANA_USDC_MINT.toBase58()) {
            const pre = preTokenBalances.find(
              (p) => p.accountIndex === post.accountIndex
            );

            if (pre && post.uiTokenAmount.uiAmount && pre.uiTokenAmount.uiAmount) {
              const diff = post.uiTokenAmount.uiAmount - pre.uiTokenAmount.uiAmount;
              
              if (diff > 0 && post.owner === toAddress) {
                // This is a transfer TO the target address
                const fromOwner = preTokenBalances.find(
                  (p) => p.mint === SOLANA_USDC_MINT.toBase58() && p.accountIndex !== post.accountIndex
                )?.owner || '';

                transfers.push({
                  from: fromOwner,
                  amount: diff.toString(),
                  signature: sig.signature,
                  blockTime: tx.blockTime,
                });
              }
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

/**
 * Get Solana explorer link for a transaction
 */
export function getSolanaExplorerLink(signature: string, cluster: string = 'mainnet'): string {
  return `https://solscan.io/tx/${signature}${cluster !== 'mainnet' ? `?cluster=${cluster}` : ''}`;
}

/**
 * Get Solana explorer link for an address
 */
export function getSolanaAddressExplorerLink(address: string, cluster: string = 'mainnet'): string {
  return `https://solscan.io/address/${address}${cluster !== 'mainnet' ? `?cluster=${cluster}` : ''}`;
}
