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
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    const where = status ? { status: status as any } : {};
    
    const deposits = await prisma.deposit.findMany({
      where,
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
    console.error('Error fetching deposits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
