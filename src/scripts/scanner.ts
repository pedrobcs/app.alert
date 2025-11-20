/**
 * Blockchain Scanner Worker
 * 
 * This script scans the Arbitrum blockchain for incoming USDC transfers
 * to the operator wallet and automatically credits deposits to users.
 * 
 * Run this script as a background job:
 * - Development: npm run scanner
 * - Production: Use a process manager like PM2 or deploy as a serverless function
 */

import { PrismaClient } from '@prisma/client';
import { scanBlocksForTransfers, getCurrentBlockNumber, verifyDepositTransaction } from '../lib/blockchain';

const prisma = new PrismaClient();

const SCAN_INTERVAL = parseInt(process.env.SCAN_INTERVAL_SECONDS || '30') * 1000;
const BLOCKS_PER_SCAN = parseInt(process.env.SCAN_BLOCKS_PER_BATCH || '1000');

async function scanForDeposits() {
  try {
    console.log('[Scanner] Starting deposit scan...');
    
    // Get settings
    const settings = await prisma.adminSettings.findFirst();
    if (!settings) {
      console.error('[Scanner] No admin settings found. Please configure the platform first.');
      return;
    }
    
    // Get current block
    const currentBlock = await getCurrentBlockNumber();
    const lastScanBlock = Number(settings.lastScanBlock) || currentBlock - 10000;
    
    // Don't scan too many blocks at once
    const fromBlock = lastScanBlock + 1;
    const toBlock = Math.min(fromBlock + BLOCKS_PER_SCAN, currentBlock);
    
    if (fromBlock > toBlock) {
      console.log('[Scanner] Already up to date');
      return;
    }
    
    console.log(`[Scanner] Scanning blocks ${fromBlock} to ${toBlock}...`);
    
    // Scan for transfers
    const transfers = await scanBlocksForTransfers(
      settings.usdcTokenAddress,
      settings.receivingWalletAddress,
      fromBlock,
      toBlock
    );
    
    console.log(`[Scanner] Found ${transfers.length} transfers`);
    
    // Process each transfer
    for (const transfer of transfers) {
      await processTransfer(transfer, settings);
    }
    
    // Update last scan block
    await prisma.adminSettings.update({
      where: { id: settings.id },
      data: { lastScanBlock: BigInt(toBlock) },
    });
    
    console.log(`[Scanner] Scan complete. Updated last scan block to ${toBlock}`);
  } catch (error) {
    console.error('[Scanner] Error during scan:', error);
  }
}

async function processTransfer(transfer: any, settings: any) {
  try {
    // Check if deposit already exists
    const existing = await prisma.deposit.findUnique({
      where: { txHash: transfer.txHash },
    });
    
    if (existing) {
      console.log(`[Scanner] Deposit ${transfer.txHash} already processed`);
      return;
    }
    
    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: { walletAddress: transfer.from.toLowerCase() },
    });
    
    if (!user) {
      console.log(`[Scanner] No user found for address ${transfer.from}. Creating placeholder.`);
      // Optionally create a user for untracked deposits
      // For now, we'll skip deposits from unknown addresses
      return;
    }
    
    // Check minimum deposit
    const minDeposit = parseFloat(settings.minimumDeposit);
    const amount = parseFloat(transfer.amount);
    
    if (amount < minDeposit) {
      console.log(`[Scanner] Deposit ${transfer.txHash} below minimum (${amount} < ${minDeposit})`);
      return;
    }
    
    // Verify the transaction
    const verification = await verifyDepositTransaction(
      transfer.txHash,
      settings.receivingWalletAddress,
      settings.usdcTokenAddress
    );
    
    if (!verification.valid) {
      console.error(`[Scanner] Verification failed for ${transfer.txHash}: ${verification.error}`);
      return;
    }
    
    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userId: user.id,
        txHash: transfer.txHash,
        fromAddress: transfer.from,
        toAddress: transfer.to,
        tokenAddress: settings.usdcTokenAddress,
        amount: transfer.amount,
        blockNumber: BigInt(transfer.blockNumber),
        blockTimestamp: new Date(transfer.timestamp * 1000),
        confirmations: verification.confirmations!,
        status: verification.confirmations! >= settings.requiredConfirmations ? 'CONFIRMED' : 'PENDING',
      },
    });
    
    console.log(`[Scanner] Created deposit ${deposit.id} for user ${user.walletAddress}`);
    
    // If enough confirmations, credit the user
    if (deposit.status === 'CONFIRMED') {
      await creditDeposit(deposit, user.id, settings);
    }
  } catch (error) {
    console.error(`[Scanner] Error processing transfer ${transfer.txHash}:`, error);
  }
}

async function creditDeposit(deposit: any, userId: string, settings: any) {
  try {
    // Calculate shares based on NAV
    const nav = parseFloat(settings.currentNav);
    const amount = parseFloat(deposit.amount);
    const shares = (amount / nav).toString();
    
    // Update deposit
    await prisma.deposit.update({
      where: { id: deposit.id },
      data: {
        status: 'CREDITED',
        creditedAt: new Date(),
        sharesIssued: shares,
        navAtDeposit: settings.currentNav,
      },
    });
    
    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalInvested: {
          increment: amount,
        },
        shares: {
          increment: parseFloat(shares),
        },
      },
    });
    
    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        amount: deposit.amount,
        shares,
        txHash: deposit.txHash,
        description: `Deposit of ${deposit.amount} USDC`,
      },
    });
    
    console.log(`[Scanner] Credited deposit ${deposit.id} (${amount} USDC = ${shares} shares)`);
  } catch (error) {
    console.error(`[Scanner] Error crediting deposit ${deposit.id}:`, error);
  }
}

async function updatePendingDeposits() {
  try {
    const settings = await prisma.adminSettings.findFirst();
    if (!settings) return;
    
    // Get pending deposits
    const pending = await prisma.deposit.findMany({
      where: {
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });
    
    for (const deposit of pending) {
      // Verify again to get updated confirmations
      const verification = await verifyDepositTransaction(
        deposit.txHash,
        settings.receivingWalletAddress,
        settings.usdcTokenAddress
      );
      
      if (verification.valid && verification.confirmations! >= settings.requiredConfirmations) {
        if (deposit.status === 'PENDING') {
          await prisma.deposit.update({
            where: { id: deposit.id },
            data: { status: 'CONFIRMED' },
          });
        }
        
        if (deposit.status === 'CONFIRMED' && !deposit.creditedAt) {
          await creditDeposit(deposit, deposit.userId, settings);
        }
      }
    }
  } catch (error) {
    console.error('[Scanner] Error updating pending deposits:', error);
  }
}

async function main() {
  console.log('[Scanner] Blockchain scanner started');
  console.log(`[Scanner] Scan interval: ${SCAN_INTERVAL / 1000}s`);
  console.log(`[Scanner] Blocks per scan: ${BLOCKS_PER_SCAN}`);
  
  // Initial scan
  await scanForDeposits();
  await updatePendingDeposits();
  
  // Set up interval
  setInterval(async () => {
    await scanForDeposits();
    await updatePendingDeposits();
  }, SCAN_INTERVAL);
}

// Run scanner
main().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('[Scanner] Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});
