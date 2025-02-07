import { FC } from 'react';
import styles from '../styles/Home.module.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';

export const OfficeAppBar: FC = () => {

    const router = useRouter();
    
    const navigateTo = (path: string) => {
        router.push(path);
    };

    return (
        <div className={styles.AppHeader}>
            <div className={styles.LeftSection}>
                <button className={styles.BackButton} onClick={() => router.replace("/")}>
                &#x2B9C;
                </button>
                <button className={styles.NavButton} onClick={() => router.replace("/farm")}>NFT</button>
                <button className={styles.NavButton}>FARM</button>
            </div>
            <div className={styles.RightSection}>
                <WalletMultiButton/>
            </div>
        </div>
    );
};
