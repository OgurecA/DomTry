import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = useMemo(() => 'devnet', []);
  const MainnetEndpoint = useMemo(() => 'https://alien-winter-road.solana-mainnet.quiknode.pro/4c7de5bdc89d47c6d70670f9e22e690c08c9f71a/', []);
  const wallets = useMemo(() => [
    new walletAdapterWallets.PhantomWalletAdapter(),
    new walletAdapterWallets.SafePalWalletAdapter(),
    new walletAdapterWallets.CloverWalletAdapter(),
    new walletAdapterWallets.BitKeepWalletAdapter(),
    new walletAdapterWallets.CoinhubWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default WalletContextProvider