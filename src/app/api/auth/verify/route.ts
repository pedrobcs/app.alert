import { NextRequest, NextResponse } from 'next/server';
import { verifySignature, createSignMessage, generateToken, updateUserNonce } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, signature } = await req.json();
    
    if (!walletAddress || !signature) {
      return NextResponse.json(
        { error: 'Wallet address and signature are required' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });
    
    if (!user || !user.nonce) {
      return NextResponse.json(
        { error: 'User not found or nonce not generated' },
        { status: 404 }
      );
    }
    
    // Verify signature
    const message = createSignMessage(user.nonce, walletAddress);
    const isValid = verifySignature(message, signature, walletAddress);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Generate new nonce for next login
    await updateUserNonce(user.id);
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      walletAddress: user.walletAddress,
    });
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        kycVerified: user.kycVerified,
      },
      token,
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
