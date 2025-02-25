'use client'

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as web3 from '@solana/web3.js'
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = useMemo(() => web3.clusterApiUrl('devnet'), []);
  const wallets = useMemo(() => [
    new walletAdapterWallets.PhantomWalletAdapter(),
    new walletAdapterWallets.SafePalWalletAdapter(),
    new walletAdapterWallets.CloverWalletAdapter(),
    new walletAdapterWallets.BitKeepWalletAdapter(),
    new walletAdapterWallets.CoinhubWalletAdapter(),
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