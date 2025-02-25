import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { AppBar } from '../components/AppBar'
import Head from 'next/head'
import { Back } from '../components/Back'

const Home: NextPage = () => {


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
          <p className={styles.text} onClick={() => window.open("https://x.com/dominator24news", "_blank")}>
            Work in progress...
          </p>
          <p onClick={() => window.location.href = "mailto:contact@dominators.website"}>contact@dominators.website</p>
        </div>
      </Back>
    </div>
  );
}

export default Home;