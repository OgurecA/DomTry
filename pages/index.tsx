import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { AppBar } from '../components/AppBar'
import Head from 'next/head'
import { Back } from '../components/Back'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const Home: NextPage = () => {

  const [isMobileLayout, setIsMobileLayout] = useState<boolean | null>(false);
      
          useEffect(() => {
              const handleResize = () => {
                  setIsMobileLayout(window.innerWidth < 780);
              };
      
              // Вызываем сразу при загрузке
              handleResize();
              window.addEventListener("resize", handleResize);
      
              return () => window.removeEventListener("resize", handleResize);
          }, []);


          useEffect(() => {
            async function fetchFingerprint() {
              // Initialize FingerprintJS and get the visitor identifier.
              const fpPromise = FingerprintJS.load();
              const fp = await fpPromise;
              const result = await fp.get();
    
              console.log(result)
            }
        
            fetchFingerprint();
          })

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
          {isMobileLayout && (
                <WalletMultiButton className={styles.walletButton}/>
            )} {/* НЕ РАБОТАЕТ ИЗ-ЗА СТИЛЕЙ */}
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