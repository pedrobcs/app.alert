/**
 * API Route: Create Bot
 * 
 * Creates a new trading bot configuration
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      walletAddress,
      name,
      market,
      mode,
      timeframe,
      lookbackBars,
      volumeThreshold,
      accumulationSensitivity,
      distributionSensitivity,
      positionSizePct,
      maxLeverage,
      stopLossPct,
      takeProfitPct,
    } = req.body;

    // Validation
    if (!walletAddress || !name || !market || !mode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress },
      });
    }

    // Create bot
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name,
        market,
        mode,
        status: 'stopped',
        
        // Strategy parameters
        timeframe: timeframe || 5,
        lookbackBars: lookbackBars || 12,
        volumeThreshold: volumeThreshold || 1.5,
        accumulationSensitivity: accumulationSensitivity || 0.7,
        distributionSensitivity: distributionSensitivity || 0.7,
        
        // Risk management
        positionSizePct: positionSizePct || 10,
        maxLeverage: maxLeverage || 5,
        stopLossPct: stopLossPct || 10,
        takeProfitPct: takeProfitPct || 40,
      },
    });

    console.log('✅ Bot created:', bot.id);

    return res.status(201).json({ bot });
  } catch (error) {
    console.error('Error creating bot:', error);
    return res.status(500).json({ error: 'Failed to create bot' });
  }
}
