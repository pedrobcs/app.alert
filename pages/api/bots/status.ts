/**
 * API Route: Bot Status
 * 
 * Returns current status and metrics for a bot
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getKeeperStatus } from '@/lib/keeper';

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

    // Fetch bot from database
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
      include: {
        trades: {
          orderBy: {
            executedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Get keeper status (if running)
    let keeperStatus = null;
    if (bot.status === 'running') {
      keeperStatus = getKeeperStatus(botId);
    }

    // Calculate stats
    const allTrades = await prisma.trade.findMany({
      where: { botId },
    });

    const totalTrades = allTrades.length;
    const successfulTrades = allTrades.filter(t => t.status === 'executed').length;
    const totalPnl = allTrades.reduce((sum, t) => sum + (t.realizedPnl || 0), 0);
    const winRate = totalTrades > 0 ? (successfulTrades / totalTrades) * 100 : 0;

    // Build response
    const response = {
      botId: bot.id,
      status: bot.status,
      lastSignal: keeperStatus?.lastSignal || (bot.lastSignal ? {
        signal: bot.lastSignal,
        reason: 'From database',
        confidence: 0,
      } : undefined),
      lastSignalTime: bot.lastSignalTime,
      currentPosition: keeperStatus?.currentPosition,
      stats: {
        totalTrades,
        successfulTrades,
        totalPnl,
        winRate,
      },
      errorMessage: bot.errorMessage,
      keeperInfo: keeperStatus ? {
        isRunning: keeperStatus.isRunning,
        lastPollTime: keeperStatus.lastPollTime,
        barsCollected: keeperStatus.barsCollected,
        errorCount: keeperStatus.errorCount,
      } : null,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching bot status:', error);
    return res.status(500).json({ error: 'Failed to fetch bot status' });
  }
}
