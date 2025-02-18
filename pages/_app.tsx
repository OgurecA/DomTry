// pages/_app.tsx
import '../styles/globals.css'; // Ваши глобальные стили
import type { AppProps } from 'next/app';
import WalletContextProvider from '../components/WalletContextProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      {/* <div className="appContainer"> */}
        <Component {...pageProps} />
      {/* </div> */}
    </WalletContextProvider>
  );
}

export default MyApp;
