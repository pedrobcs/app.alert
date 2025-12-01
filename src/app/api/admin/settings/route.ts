import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isAdmin } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await isAdmin(session.walletAddress))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.appSettings.findFirst();

    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Get admin settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await isAdmin(session.walletAddress))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const settings = await prisma.appSettings.upsert({
      where: { id: data.id || 'default' },
      update: {
        operatorWalletAddress: data.operatorWalletAddress,
        acceptedTokenAddress: data.acceptedTokenAddress,
        tokenSymbol: data.tokenSymbol,
        minimumDeposit: data.minimumDeposit,
        requiredConfirmations: data.requiredConfirmations,
        currentNAV: data.currentNAV,
        totalAUM: data.totalAUM,
        enableKYC: data.enableKYC,
        enableDeposits: data.enableDeposits,
        enableWithdrawals: data.enableWithdrawals,
        performanceYTD: data.performanceYTD,
        lastNAVUpdate: new Date(),
      },
      create: {
        operatorWalletAddress: data.operatorWalletAddress,
        acceptedTokenAddress: data.acceptedTokenAddress,
        tokenSymbol: data.tokenSymbol || 'USDC',
        minimumDeposit: data.minimumDeposit || 100,
        requiredConfirmations: data.requiredConfirmations || 5,
        currentNAV: data.currentNAV || 1.0,
        totalAUM: data.totalAUM || 0,
        enableKYC: data.enableKYC || false,
        enableDeposits: data.enableDeposits !== false,
        enableWithdrawals: data.enableWithdrawals || false,
        performanceYTD: data.performanceYTD || 0,
      },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        action: 'UPDATE_SETTINGS',
        description: 'Platform settings updated',
        metadata: data,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Update admin settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
