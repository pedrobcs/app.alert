import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { verifyDepositTransaction } from '@/lib/blockchain';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const { txHash } = await req.json();
    
    if (!txHash || typeof txHash !== 'string') {
      return NextResponse.json({ error: 'Transaction hash is required' }, { status: 400 });
    }
    
    // Check if deposit already exists
    const existingDeposit = await prisma.deposit.findUnique({
      where: { txHash },
    });
    
    if (existingDeposit) {
      return NextResponse.json({
        message: 'Deposit already tracked',
        deposit: existingDeposit,
      });
    }
    
    // Get admin settings for verification
    const settings = await prisma.adminSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ error: 'Platform not configured' }, { status: 500 });
    }
    
    // Verify the transaction
    const verification = await verifyDepositTransaction(
      txHash,
      settings.receivingWalletAddress,
      settings.usdcTokenAddress
    );
    
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || 'Invalid transaction' },
        { status: 400 }
      );
    }
    
    // Check minimum deposit
    const minDeposit = parseFloat(settings.minimumDeposit);
    const depositAmount = parseFloat(verification.amount || '0');
    
    if (depositAmount < minDeposit) {
      return NextResponse.json(
        { error: `Minimum deposit is ${minDeposit} USDC` },
        { status: 400 }
      );
    }
    
    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userId: payload.userId,
        txHash,
        fromAddress: verification.from!,
        toAddress: verification.to!,
        tokenAddress: settings.usdcTokenAddress,
        amount: verification.amount!,
        blockNumber: BigInt(verification.blockNumber!),
        blockTimestamp: new Date(verification.timestamp! * 1000),
        confirmations: verification.confirmations!,
        status: verification.confirmations! >= settings.requiredConfirmations ? 'CONFIRMED' : 'PENDING',
      },
    });
    
    // If enough confirmations, credit the user
    if (deposit.status === 'CONFIRMED') {
      await creditDeposit(deposit.id, payload.userId, verification.amount!, settings);
    }
    
    return NextResponse.json({
      success: true,
      deposit,
      message: deposit.status === 'CONFIRMED' 
        ? 'Deposit confirmed and credited' 
        : `Waiting for ${settings.requiredConfirmations - verification.confirmations!} more confirmations`,
    });
  } catch (error) {
    console.error('Error tracking deposit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function creditDeposit(
  depositId: string,
  userId: string,
  amount: string,
  settings: any
) {
  try {
    // Calculate shares based on NAV
    const nav = parseFloat(settings.currentNav);
    const shares = (parseFloat(amount) / nav).toString();
    
    // Update deposit
    await prisma.deposit.update({
      where: { id: depositId },
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
          increment: parseFloat(amount),
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
        amount,
        shares,
        txHash: (await prisma.deposit.findUnique({ where: { id: depositId } }))!.txHash,
        description: `Deposit of ${amount} USDC`,
      },
    });
    
  } catch (error) {
    console.error('Error crediting deposit:', error);
    throw error;
  }
}
