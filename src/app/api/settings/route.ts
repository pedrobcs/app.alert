import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.appSettings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await prisma.appSettings.create({
        data: {
          operatorWalletAddress: process.env.OPERATOR_WALLET_ADDRESS || '',
          acceptedTokenAddress:
            process.env.NEXT_PUBLIC_USDC_ADDRESS ||
            '0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8',
          tokenSymbol: 'USDC',
          minimumDeposit: parseFloat(process.env.MINIMUM_DEPOSIT_USDC || '100'),
          requiredConfirmations: parseInt(
            process.env.REQUIRED_CONFIRMATIONS || '5'
          ),
          enableKYC: process.env.ENABLE_KYC_REQUIREMENT === 'true',
        },
      });
    }

    return NextResponse.json({
      operatorWallet: settings.operatorWalletAddress,
      solanaOperatorWallet: settings.solanaOperatorWallet || '',
      tokenAddress: settings.acceptedTokenAddress,
      tokenSymbol: settings.tokenSymbol,
      minimumDeposit: settings.minimumDeposit,
      requiredConfirmations: settings.requiredConfirmations,
      currentNAV: settings.currentNAV,
      totalAUM: settings.totalAUM,
      enableKYC: settings.enableKYC,
      enableDeposits: settings.enableDeposits,
      enableWithdrawals: settings.enableWithdrawals,
      performanceYTD: settings.performanceYTD,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
