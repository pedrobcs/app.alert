import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { updateStrategyStatusSchema } from '@/lib/validation/strategy';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = updateStrategyStatusSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const plan = await prisma.strategyPlan.updateMany({
      where: { id: params.id, userId: session.userId },
      data: { status: parsed.data.status },
    });

    if (plan.count === 0) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
    }

    const updated = await prisma.strategyPlan.findUnique({ where: { id: params.id } });
    return NextResponse.json({ plan: updated });
  } catch (error) {
    console.error('Update strategy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deleted = await prisma.strategyPlan.deleteMany({
      where: { id: params.id, userId: session.userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete strategy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
