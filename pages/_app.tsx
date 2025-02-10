// pages/_app.tsx
import '../styles/globals.css'; // Ваши глобальные стили
import type { AppProps } from 'next/app';
import WalletContextProvider from '../components/WalletContextProvider';
import styles from "../styles/Home.module.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <div className={styles.App}>
      <Component {...pageProps} />
      </div>
    </WalletContextProvider>
  );
}

export default MyApp;
