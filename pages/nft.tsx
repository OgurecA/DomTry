import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { AppBar } from '../components/AppBar'
import Head from 'next/head'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Back } from '../components/Back'
import { WelcomeText } from '../components/WelcomeText'

const Home: NextPage = (props) => {

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  return (
    <div className={styles.App}>
      <Head>
        <title>Dominators</title>
        <meta
          name="description"
          content="Dominators"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar />
      <Back>
        <WelcomeText />
      </Back>
    </div>
  );
}

export default Home;