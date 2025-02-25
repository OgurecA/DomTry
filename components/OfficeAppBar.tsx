import { FC, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';

export const OfficeAppBar: FC = () => {
    const router = useRouter();
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

    if (isMobileLayout) return null; // 📌 Если не мобильная версия, ничего не рендерим

    return (
        <div className={styles.AppHeaderOffice}>
            <div className={styles.LeftSection}>
                <button className={styles.BackButton} onClick={() => router.replace("/")}></button>
                <button className={styles.NavButton} onClick={() => router.replace("/farm")}>FARM</button>
                <button className={styles.NavButton} onClick={() => router.replace("/nfts")}>NFT&apos;s</button>
            </div>
            <div className={styles.RightSection}>
                <WalletMultiButton className={styles.walletButton}/>
            </div>
        </div>
    );
};
