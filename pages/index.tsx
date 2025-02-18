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
          <p className={styles.title}>
            Web3 Game
          </p>
          <h2 onClick={() => window.open("https://x.com/dominator24news", "_blank")}>
            Work in progress...
          </h2>
          <p onClick={() => window.location.href = "mailto:contact@dominators.website"}>contact@dominators.website</p>
        </div>
      </Back>
    </div>
  );
}

export default Home;