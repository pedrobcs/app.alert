import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Simple admin auth check (in production, use proper admin authentication)
async function checkAdminAuth(req: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin-token')?.value;
  // In production, verify admin JWT token
  return !!adminToken;
}

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const settings = await prisma.adminSettings.findFirst();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Check if settings exist
    const existing = await prisma.adminSettings.findFirst();
    
    let settings;
    if (existing) {
      settings = await prisma.adminSettings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      settings = await prisma.adminSettings.create({
        data,
      });
    }
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
