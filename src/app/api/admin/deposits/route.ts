import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await isAdmin(session.walletAddress))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deposits = await prisma.deposit.findMany({
      include: {
        user: {
          select: {
            walletAddress: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ deposits });
  } catch (error) {
    console.error('Get admin deposits error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
