import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const FUNDING_RADAR = [
  {
    id: 'btc-binance',
    pair: 'BTC-PERP',
    venue: 'Binance',
    fundingBps: -6.2,
    nextWindow: '08:00 UTC',
    pressure: 'Longs paying shorts',
    confidence: 'HIGH',
  },
  {
    id: 'eth-okx',
    pair: 'ETH-PERP',
    venue: 'OKX',
    fundingBps: -2.1,
    nextWindow: '12:00 UTC',
    pressure: 'Neutralizing',
    confidence: 'MED',
  },
  {
    id: 'sol-bybit',
    pair: 'SOL-PERP',
    venue: 'Bybit',
    fundingBps: 4.4,
    nextWindow: '16:00 UTC',
    pressure: 'Shorts paying longs',
    confidence: 'LOW',
  },
];

const MARKET_PULSE = [
  {
    id: 'open-interest',
    title: 'Open interest expansion',
    change: '+8.3%',
    detail: 'OI on BTC perps added $480M overnight with no spot follow through. Dealers likely short gamma into Asia.',
  },
  {
    id: 'basis',
    title: 'Basis normalized',
    change: '-12 bps',
    detail: 'Quarterly futures basis retraced back inside 60bps annualized after aggressive short hedging on FTX restart rumors.',
  },
  {
    id: 'liquidity',
    title: 'Liquidity pockets',
    change: 'New level',
    detail: 'CVD shows resting bids at 62.8k BTC with thin books above 65k. Expect slippage if chasing breakout legs.',
  },
];

const ACTION_ITEMS = [
  {
    id: 'journal-touch',
    label: 'Journal update',
    description: 'Document why ETH structure shifted to balanced after Shanghai gamma roll-off.',
  },
  {
    id: 'funding-check',
    label: 'Funding hedge',
    description: 'Consider offsetting BTC funding bleed with calendar spread if premium persists for 2 more windows.',
  },
  {
    id: 'liquidity-review',
    label: 'Liquidity review',
    description: 'Recalculate max venue size for SOL after Bybit slippage alert triggered.',
  },
];

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [user, plans] = await Promise.all([
      prisma.user.findUnique({
        where: { walletAddress: session.walletAddress },
        select: { id: true, walletAddress: true, createdAt: true },
      }),
      prisma.strategyPlan.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalConviction = plans.reduce((sum, plan) => sum + plan.conviction, 0);
    const totalRiskBps = plans.reduce((sum, plan) => sum + plan.riskBps, 0);
    const livePlans = plans.filter((plan) => plan.status === 'LIVE').length;
    const readyPlans = plans.filter((plan) => plan.status === 'READY').length;

    return NextResponse.json({
      profile: {
        walletAddress: user.walletAddress,
        onboardedAt: user.createdAt,
        totalPlans: plans.length,
      },
      strategySummary: {
        livePlans,
        readyPlans,
        drafts: plans.filter((plan) => plan.status === 'DRAFT').length,
        avgConviction: plans.length ? (totalConviction / plans.length).toFixed(1) : '0.0',
        avgRiskBps: plans.length ? Math.round(totalRiskBps / plans.length) : 0,
        activeMarkets: Array.from(new Set(plans.map((plan) => plan.market))).length,
      },
      upcoming: plans.filter((plan) => plan.status !== 'ARCHIVED').slice(0, 4),
      fundingRadar: FUNDING_RADAR,
      marketPulse: MARKET_PULSE,
      actionItems: ACTION_ITEMS,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Workspace summary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
