import { FC } from 'react';
import styles from '../styles/Home.module.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';

export const OfficeAppBar: FC = () => {

    const router = useRouter();
    

    return (
        <div className={styles.AppHeaderOffice}>
            <div className={styles.LeftSection}>
                <button className={styles.BackButton} onClick={() => router.replace("/")}></button>
                <button className={styles.NavButton}>NFT</button>
                <button className={styles.NavButton} onClick={() => router.replace("/farm")}>FARM</button>
            </div>
            <div className={styles.RightSection}>
                <WalletMultiButton/>
            </div>
        </div>
    );
};
