import { FC } from 'react';
import styles from '../styles/Home.module.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const AppBar: FC = () => {
    return (
        <div className={styles.AppHeader}>
            <div className={styles.LeftSection}>
                <img src="/chip.png" className={styles.LogoImage}/>
                <span style={{ fontWeight: 'bold' }}>BLOCKCHAIN POKER</span>
            </div>
            <div className={styles.RightSection}>
                <WalletMultiButton/>
            </div>
        </div>
    );
};
