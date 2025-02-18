import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as web3 from '@solana/web3.js'
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import WalletRedirect from './WalletRedirect';
require('@solana/wallet-adapter-react-ui/styles.css');

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = useMemo(() => web3.clusterApiUrl('devnet'), []);
  const wallets = useMemo(() => [
		new walletAdapterWallets.PhantomWalletAdapter(),
		new walletAdapterWallets.SlopeWalletAdapter(),
		new walletAdapterWallets.SafePalWalletAdapter(),
		new walletAdapterWallets.CloverWalletAdapter(),
		new walletAdapterWallets.SolletWalletAdapter(),
		new walletAdapterWallets.BitKeepWalletAdapter(),
		new walletAdapterWallets.CoinhubWalletAdapter(),
	], []);

	return (
	<ConnectionProvider endpoint={endpoint}>
	  <WalletProvider wallets={wallets} autoConnect={false}>
	    <WalletModalProvider>
	        { children }
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
	)
}

export default WalletContextProvider