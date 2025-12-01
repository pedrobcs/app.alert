import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { updateStrategyStatusSchema } from '@/lib/validation/strategy';

const getStrategyId = (request: NextRequest) => {
  const segments = request.nextUrl.pathname.split('/');
  return segments.pop() || null;
};

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const strategyId = getStrategyId(request);
    if (!strategyId) {
      return NextResponse.json({ error: 'Invalid strategy id' }, { status: 400 });
    }

    const parsed = updateStrategyStatusSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const plan = await prisma.strategyPlan.updateMany({
      where: { id: strategyId, userId: session.userId },
      data: { status: parsed.data.status },
    });

    if (plan.count === 0) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
    }

    const updated = await prisma.strategyPlan.findUnique({
      where: { id: strategyId },
    });
    return NextResponse.json({ plan: updated });
  } catch (error) {
    console.error('Update strategy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const strategyId = getStrategyId(request);
    if (!strategyId) {
      return NextResponse.json({ error: 'Invalid strategy id' }, { status: 400 });
    }

    const deleted = await prisma.strategyPlan.deleteMany({
      where: { id: strategyId, userId: session.userId },
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
