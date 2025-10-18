/**
 * API Route: Get Bot Trades
 * 
 * Returns trade history for a bot
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { botId } = req.query;

    if (!botId || typeof botId !== 'string') {
      return res.status(400).json({ error: 'Bot ID required' });
    }

    // Fetch trades
    const trades = await prisma.trade.findMany({
      where: { botId },
      orderBy: {
        executedAt: 'desc',
      },
      take: 100, // Limit to last 100 trades
    });

    return res.status(200).json({ trades });
  } catch (error) {
    console.error('Error fetching trades:', error);
    return res.status(500).json({ error: 'Failed to fetch trades' });
  }
}
