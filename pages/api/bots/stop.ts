/**
 * API Route: Stop Bot
 * 
 * Stops a running bot and its keeper process
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { stopKeeper } from '@/lib/keeper';

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

    // Stop keeper
    stopKeeper(botId);

    // Update bot status
    await prisma.bot.update({
      where: { id: botId },
      data: { 
        status: 'stopped',
        errorMessage: null,
      },
    });

    console.log(`✅ Bot stopped: ${botId}`);

    return res.status(200).json({ success: true, message: 'Bot stopped' });
  } catch (error) {
    console.error('Error stopping bot:', error);
    return res.status(500).json({ error: 'Failed to stop bot' });
  }
}
