import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import {
  createStrategySchema,
  strategyStatusValues,
} from '@/lib/validation/strategy';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await prisma.strategyPlan.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    });

    const statusCounts = strategyStatusValues.reduce<Record<string, number>>(
      (acc, status) => ({
        ...acc,
        [status]: plans.filter((plan) => plan.status === status).length,
      }),
      {}
    );

    const avgRiskBps = plans.length
      ? Math.round(plans.reduce((sum, plan) => sum + plan.riskBps, 0) / plans.length)
      : 0;
    const avgConviction = plans.length
      ? (plans.reduce((sum, plan) => sum + plan.conviction, 0) / plans.length).toFixed(1)
      : '0.0';

    return NextResponse.json({
      plans,
      summary: {
        total: plans.length,
        statusCounts,
        avgRiskBps,
        avgConviction,
        activeMarkets: Array.from(new Set(plans.map((plan) => plan.market))).length,
        nextUp: plans.filter((plan) => plan.status === 'READY').slice(0, 3),
      },
    });
  } catch (error) {
    console.error('Get strategies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const parsed = createStrategySchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const plan = await prisma.strategyPlan.create({
      data: {
        userId: session.userId,
        ...parsed.data,
        tags: parsed.data.tags ?? [],
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('Create strategy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
