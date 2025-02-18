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
        <div className={styles.welcomeTextContainer}>
          <h2>
            Web3 Game
          </h2>
          <h2>
            Work in progress...
          </h2>
          <h2>
            Coming soon 2025
          </h2>
          <p>contact@dominators.website</p>
        </div>
      </Back>
    </div>
  );
}

export default Home;