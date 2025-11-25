import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUSDCTransfer } from '@/lib/blockchain';
import { verifySolanaUSDCTransfer } from '@/lib/solana';
import { getSession } from '@/lib/auth';

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

    // Verify hash format based on chain
    const isArbitrum = chain === 'arbitrum';
    const isSolana = chain === 'solana';

    if (isArbitrum && !/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      return NextResponse.json(
        { error: 'Invalid Arbitrum transaction hash' },
        { status: 400 }
      );
    }

    if (isSolana && !/^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(txHash)) {
      return NextResponse.json(
        { error: 'Invalid Solana transaction signature' },
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

    // Get app settings
    const settings = await prisma.appSettings.findFirst();
    if (!settings) {
      return NextResponse.json(
        { error: 'App settings not configured' },
        { status: 500 }
      );
    }

    // Check if chain is enabled
    if (isSolana && !settings.enableSolanaDeposits) {
      return NextResponse.json(
        { error: 'Solana deposits are not enabled' },
        { status: 400 }
      );
    }

    // Get operator wallet for the chain
    const operatorWallet = isSolana 
      ? settings.solanaWalletAddress 
      : settings.operatorWalletAddress;

    if (!operatorWallet) {
      return NextResponse.json(
        { error: `${chain} operator wallet not configured` },
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

    // Verify transaction on-chain based on chain type
    let transfer: any = null;

    if (isArbitrum) {
      transfer = await verifyUSDCTransfer(
        txHash,
        userAddress,
        operatorWallet,
        settings.minimumDeposit
      );
    } else if (isSolana) {
      const solanaTransfer = await verifySolanaUSDCTransfer(
        txHash,
        userAddress,
        operatorWallet,
        settings.minimumDeposit
      );

      if (solanaTransfer && solanaTransfer.status === 'success') {
        // Convert Solana transfer format to match Arbitrum format
        transfer = {
          hash: solanaTransfer.signature,
          from: solanaTransfer.from || userAddress,
          to: solanaTransfer.to || operatorWallet,
          tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on Solana
          tokenAmount: solanaTransfer.amount,
          confirmations: solanaTransfer.confirmations,
          blockNumber: solanaTransfer.slot,
          timestamp: solanaTransfer.blockTime,
        };
      }
    }

    if (!transfer) {
      return NextResponse.json(
        {
          error: `Transaction verification failed on ${chain}. Ensure it's a USDC transfer to the operator wallet.`,
        },
        { status: 400 }
      );
    }

    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userId: user.id,
        txHash: transfer.hash,
        fromAddress: transfer.from.toLowerCase(),
        toAddress: transfer.to.toLowerCase(),
        tokenAddress: transfer.tokenAddress.toLowerCase(),
        amount: parseFloat(transfer.tokenAmount),
        amountUSD: parseFloat(transfer.tokenAmount),
        confirmations: transfer.confirmations,
        blockNumber: BigInt(transfer.blockNumber || 0),
        timestamp: transfer.timestamp ? new Date(transfer.timestamp * 1000) : null,
        chain: isSolana ? 'SOLANA' : 'ARBITRUM',
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
        chain: deposit.chain,
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
