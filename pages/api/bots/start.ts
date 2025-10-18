/**
 * API Route: Start Bot
 * 
 * Starts a bot and spawns keeper process
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { startKeeper } from '@/lib/keeper';
import { BotConfig } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { botId } = req.body;

    if (!botId) {
      return res.status(400).json({ error: 'Bot ID required' });
    }

    // Fetch bot from database
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Check if custodial mode requires private key
    if (bot.mode === 'custodial' && !process.env.KEEPER_PRIVATE_KEY) {
      return res.status(400).json({ 
        error: 'Custodial mode requires KEEPER_PRIVATE_KEY environment variable' 
      });
    }

    // Update bot status
    await prisma.bot.update({
      where: { id: botId },
      data: { 
        status: 'running',
        errorMessage: null,
      },
    });

    // Convert to BotConfig
    const botConfig: BotConfig = {
      id: bot.id,
      userId: bot.userId,
      name: bot.name,
      market: bot.market,
      mode: bot.mode as 'non-custodial' | 'custodial',
      status: 'running',
      timeframe: bot.timeframe,
      wyckoffParams: {
        lookbackBars: bot.lookbackBars,
        volumeThreshold: bot.volumeThreshold,
        accumulationSensitivity: bot.accumulationSensitivity,
        distributionSensitivity: bot.distributionSensitivity,
      },
      positionSizePct: bot.positionSizePct,
      maxLeverage: bot.maxLeverage,
      stopLossPct: bot.stopLossPct,
      takeProfitPct: bot.takeProfitPct,
      maxDailyLoss: bot.maxDailyLoss || undefined,
    };

    // Start keeper
    await startKeeper(botConfig);

    console.log(`✅ Bot started: ${botId}`);

    return res.status(200).json({ success: true, message: 'Bot started' });
  } catch (error: any) {
    console.error('Error starting bot:', error);
    
    // Update bot with error
    if (req.body.botId) {
      await prisma.bot.update({
        where: { id: req.body.botId },
        data: { 
          status: 'error',
          errorMessage: error.message || 'Failed to start bot',
        },
      });
    }
    
    return res.status(500).json({ error: error.message || 'Failed to start bot' });
  }
}
