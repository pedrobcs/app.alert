import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create default app settings if they don't exist
  const settings = await prisma.appSettings.findFirst();
  
  if (!settings) {
    await prisma.appSettings.create({
      data: {
        operatorWalletAddress: process.env.OPERATOR_WALLET_ADDRESS || '',
        acceptedTokenAddress: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8',
        tokenSymbol: 'USDC',
        minimumDeposit: 100,
        requiredConfirmations: 5,
        currentNAV: 1.0,
        totalAUM: 0,
        enableKYC: false,
        enableDeposits: true,
        enableWithdrawals: false,
        performanceYTD: 0,
      },
    });
    
    console.log('✅ Created default app settings');
  } else {
    console.log('ℹ️  App settings already exist');
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
