import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

async function checkAdminAuth(req: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin-token')?.value;
  return !!adminToken;
}

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get statistics
    const totalUsers = await prisma.user.count();
    
    const totalDeposits = await prisma.deposit.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'CREDITED',
      },
    });
    
    const pendingDeposits = await prisma.deposit.count({
      where: {
        status: 'PENDING',
      },
    });
    
    const totalInvested = await prisma.user.aggregate({
      _sum: {
        totalInvested: true,
      },
    });
    
    return NextResponse.json({
      totalUsers,
      totalDepositsAmount: totalDeposits._sum.amount || '0',
      totalInvestedAmount: totalInvested._sum.totalInvested || '0',
      pendingDepositsCount: pendingDeposits,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
