import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUSDCTransfer } from '@/lib/blockchain';
import { verifySolanaUSDCTransfer } from '@/lib/solana';
import { getSession } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { txHash, userAddress, chain = 'arbitrum' } = await request.json();

    if (!txHash || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify tx hash format based on chain
    const isArbitrum = chain === 'arbitrum';
    const isValidHash = isArbitrum 
      ? /^0x[a-fA-F0-9]{64}$/.test(txHash)
      : /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(txHash); // Solana signature format

    if (!isValidHash) {
      return NextResponse.json(
        { error: `Invalid ${chain} transaction hash` },
        { status: 400 }
      );
    }

    // Check if deposit already exists
    const existingDeposit = await prisma.deposit.findUnique({
      where: { txHash },
    });

    if (existingDeposit) {
      return NextResponse.json(
        { error: 'Transaction already tracked', deposit: existingDeposit },
        { status: 409 }
      );
    }

    // Get app settings for operator wallet
    const settings = await prisma.appSettings.findFirst();
    if (!settings) {
      return NextResponse.json(
        { error: 'App settings not configured' },
        { status: 500 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify transaction on-chain based on chain
    let transfer;
    let operatorWallet;
    
    if (chain === 'arbitrum') {
      operatorWallet = settings.operatorWalletAddress;
      transfer = await verifyUSDCTransfer(
        txHash,
        userAddress,
        operatorWallet,
        settings.minimumDeposit
      );
    } else if (chain === 'solana') {
      operatorWallet = settings.solanaOperatorWallet;
      if (!operatorWallet) {
        return NextResponse.json(
          { error: 'Solana operator wallet not configured' },
          { status: 500 }
        );
      }
      transfer = await verifySolanaUSDCTransfer(
        txHash,
        userAddress,
        operatorWallet,
        settings.minimumDeposit
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid chain specified' },
        { status: 400 }
      );
    }

    if (!transfer) {
      return NextResponse.json(
        {
          error:
            `Transaction verification failed on ${chain}. Ensure the transaction is a USDC transfer to the operator wallet.`,
        },
        { status: 400 }
      );
    }

    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userId: user.id,
        txHash: chain === 'arbitrum' ? transfer.hash : transfer.signature,
        fromAddress: transfer.from.toLowerCase(),
        toAddress: transfer.to.toLowerCase(),
        tokenAddress: (chain === 'arbitrum' ? transfer.tokenAddress : transfer.tokenMint).toLowerCase(),
        amount: parseFloat(transfer.tokenAmount),
        amountUSD: parseFloat(transfer.tokenAmount),
        confirmations: transfer.confirmations,
        blockNumber: chain === 'arbitrum' ? BigInt(transfer.blockNumber || 0) : BigInt(0),
        timestamp: transfer.blockTime ? new Date(transfer.blockTime * 1000) : (transfer.timestamp ? new Date(transfer.timestamp * 1000) : null),
        chain: chain,
        status:
          transfer.confirmations >= settings.requiredConfirmations
            ? 'CONFIRMED'
            : 'PENDING',
      },
    });

    // If confirmed, credit user
    if (deposit.status === 'CONFIRMED') {
      const nav = settings.currentNAV || 1.0;
      const shares = deposit.amount / nav;

      await prisma.deposit.update({
        where: { id: deposit.id },
        data: {
          status: 'CREDITED',
          shares,
          navAtDeposit: nav,
          creditedAt: new Date(),
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalInvested: { increment: deposit.amount },
          totalShares: { increment: shares },
        },
      });
    }

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        status: deposit.status,
        confirmations: deposit.confirmations,
        txHash: deposit.txHash,
      },
    });
  } catch (error) {
    console.error('Deposit tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
