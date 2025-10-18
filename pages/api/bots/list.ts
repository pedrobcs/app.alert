/**
 * API Route: List Bots
 * 
 * Returns all bots for a given wallet address
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
    const { wallet } = req.query;

    if (!wallet || typeof wallet !== 'string') {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: wallet },
      include: {
        bots: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return res.status(200).json({ bots: [] });
    }

    return res.status(200).json({ bots: user.bots });
  } catch (error) {
    console.error('Error fetching bots:', error);
    return res.status(500).json({ error: 'Failed to fetch bots' });
  }
}
