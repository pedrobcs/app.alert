import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();
    
    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Get or create user and return nonce
    const user = await getOrCreateUser(walletAddress);
    
    return NextResponse.json({
      nonce: user.nonce,
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    console.error('Error generating nonce:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
