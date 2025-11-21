import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: session.walletAddress },
      include: {
        deposits: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get app settings for NAV
    const settings = await prisma.appSettings.findFirst();

    // Calculate current value
    const currentValue = user.totalShares * (settings?.currentNAV || 1.0);
    const returns = currentValue - user.totalInvested;
    const returnsPercentage =
      user.totalInvested > 0 ? (returns / user.totalInvested) * 100 : 0;

    return NextResponse.json({
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        email: user.email,
        totalInvested: user.totalInvested,
        totalShares: user.totalShares,
        currentValue,
        returns,
        returnsPercentage,
        isKycVerified: user.isKycVerified,
        createdAt: user.createdAt,
      },
      recentDeposits: user.deposits,
      settings: settings
        ? {
            operatorWallet: settings.operatorWalletAddress,
            tokenAddress: settings.acceptedTokenAddress,
            tokenSymbol: settings.tokenSymbol,
            minimumDeposit: settings.minimumDeposit,
            currentNAV: settings.currentNAV,
            performanceYTD: settings.performanceYTD,
          }
        : null,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
