import { FC } from 'react';
import styles from '../styles/Home.module.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const AppBar: FC = () => {
          
    return (
        <div className={styles.AppHeader}>
            <div className={styles.LeftSection}>
                <img src="/BarsukNewPNG.png" className={styles.LogoImage}/>
                <span style={{ fontWeight: 'bold' }}>DOMINATORS</span>
                {/* <button className={styles.NavButton} onClick={() => navigateTo('/office')}>OFFICE</button> */}
            </div>
            <div className={styles.RightSection}>
                <WalletMultiButton className={styles.walletButton}/> {/* НЕ РАБОТАЕТ ИЗ-ЗА СТИЛЕЙ */}
            </div>
        </div>
    );
};
