import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import WalletContextProvider from '../components/WalletContextProvider'
import { AppBar } from '../components/AppBar'
import Head from 'next/head'
import RoleChoose from '../components/RoleChoose'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const Home: NextPage = (props) => {

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  return (
    <div className={styles.App}>
      <Head>
        <title>Wallet-Adapter Example</title>
        <meta
          name="description"
          content="Wallet-Adapter Example"
        />
      </Head>
        <AppBar />
        <RoleChoose />
    </div>
  );
}

export default Home;