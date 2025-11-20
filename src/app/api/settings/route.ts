import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.adminSettings.findFirst();
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not configured' },
        { status: 404 }
      );
    }
    
    // Return only public settings
    return NextResponse.json({
      receivingWalletAddress: settings.receivingWalletAddress,
      usdcTokenAddress: settings.usdcTokenAddress,
      tokenSymbol: settings.tokenSymbol,
      minimumDeposit: settings.minimumDeposit,
      requiredConfirmations: settings.requiredConfirmations,
      kycRequired: settings.kycRequired,
      currentNav: settings.currentNav,
      withdrawalsEnabled: settings.withdrawalsEnabled,
      termsUrl: settings.termsUrl,
      privacyPolicyUrl: settings.privacyPolicyUrl,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
