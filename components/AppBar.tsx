import { FC } from 'react';
import styles from '../styles/Home.module.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';
import { publicKey } from '@solana/web3.js/src/layout';
import { useWallet } from '@solana/wallet-adapter-react';

export const AppBar: FC = () => {
    
    const router = useRouter();

    const { publicKey, sendTransaction } = useWallet();
    
    const navigateTo = (path: string) => {
        if (!publicKey) {
            alert("Please connect wallet first!")
        } else {
            router.push(path);
        }
      };

      
    return (
        <div className={styles.AppHeader}>
            <div className={styles.LeftSection}>
                <img src="/BarsukNewPNG.png" className={styles.LogoImage}/>
                <span style={{ fontWeight: 'bold' }}>DOMINATORS</span>
                {/* <button className={styles.NavButton} onClick={() => navigateTo('/office')}>OFFICE</button> */}
            </div>
            <div className={styles.RightSection}>
                <WalletMultiButton className={styles.walletButton}/>{/* НЕ РАБОТАЕТ ИЗ-ЗА СТИЛЕЙ */}
            </div>
        </div>
    );
};
