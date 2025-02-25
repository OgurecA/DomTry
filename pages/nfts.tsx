import styles from '../styles/Nfts.module.css'
import { NftsAppBar } from '../components/NftsAppBar'
import { BackOffice } from '../components/BackOffice'
import { NavBarNfts } from '../components/NavBarNfts'
import { useEffect, useState } from 'react'

const NftsPage = () => {

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

    return (
      <BackOffice>
        <NftsAppBar />
        {isMobileLayout && <NavBarNfts />}
        {isMobileLayout ? (
          <div className={styles.scrollableContainer}>
            <div className={styles.nftWrapper}>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.nftWrapper}>
            <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
              <div className={styles.nftContainer}>
                <img src={"/Avatar.png"} alt={"f"} className={styles.nftImage} />
              </div>
          </div>
        )}
      </BackOffice>
    );
    
}

export default NftsPage;