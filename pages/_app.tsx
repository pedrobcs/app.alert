import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WalletConnectorProvider } from '@/components/WalletConnector';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectorProvider>
      <Component {...pageProps} />
    </WalletConnectorProvider>
  );
}
