// pages/_app.tsx
import '../styles/globals.css'; // Ваши глобальные стили
import type { AppProps } from 'next/app';
import WalletContextProvider from '../components/WalletContextProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <div className="bg-gray-500">
        <Component {...pageProps} />
      </div>
    </WalletContextProvider>
  );
}

export default MyApp;
