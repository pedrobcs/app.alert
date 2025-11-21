import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: normalizedAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: normalizedAddress,
          nonce: randomBytes(32).toString('hex'),
        },
      });
    } else {
      // Generate new nonce
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          nonce: randomBytes(32).toString('hex'),
        },
      });
    }

    return NextResponse.json({
      nonce: user.nonce,
      message: `Sign this message to authenticate with ArbiBot:\n\nNonce: ${user.nonce}\nWallet: ${normalizedAddress}`,
    });
  } catch (error) {
    console.error('Nonce generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
