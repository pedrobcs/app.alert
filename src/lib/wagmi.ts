import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

export const wagmiConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'USDC Investment Platform',
  projectId,
  chains: [
    arbitrum,
    ...(process.env.NODE_ENV === 'development' ? [arbitrumSepolia] : []),
  ],
  ssr: true,
});
