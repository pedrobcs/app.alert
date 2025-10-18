/**
 * API Route: Execute Trade
 * 
 * Handles both custodial and non-custodial trade execution
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
    const { botId, instruction, signedTransaction } = req.body;

    if (!botId) {
      return res.status(400).json({ error: 'Bot ID required' });
    }

    // Fetch bot
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Non-custodial mode: user provides signed transaction
    if (bot.mode === 'non-custodial') {
      if (!signedTransaction) {
        return res.status(400).json({ error: 'Signed transaction required for non-custodial mode' });
      }

      // TODO: Submit signed transaction to Solana
      // const connection = new Connection(process.env.RPC_URL!);
      // const signature = await connection.sendRawTransaction(Buffer.from(signedTransaction, 'base64'));
      
      return res.status(501).json({ 
        error: 'Non-custodial trade execution not yet implemented',
        message: 'Use custodial mode for automated trading'
      });
    }

    // Custodial mode: server executes trade
    // This is handled by the keeper loop, not this endpoint
    return res.status(400).json({ 
      error: 'Custodial trades are executed automatically by the keeper',
      message: 'Start the bot to enable automatic trading'
    });

  } catch (error) {
    console.error('Error executing trade:', error);
    return res.status(500).json({ error: 'Failed to execute trade' });
  }
}
