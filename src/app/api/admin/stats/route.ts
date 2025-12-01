import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isAdmin } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await isAdmin(session.walletAddress))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalUsers, deposits] = await Promise.all([
      prisma.user.count(),
      prisma.deposit.findMany({
        where: {
          status: {
            in: ['CONFIRMED', 'CREDITED'],
          },
        },
      }),
    ]);

    const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
    const pendingDeposits = await prisma.deposit.count({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMING'],
        },
      },
    });

    return NextResponse.json({
      totalUsers,
      totalDeposits,
      pendingDeposits,
      depositCount: deposits.length,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
