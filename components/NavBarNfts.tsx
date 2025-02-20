import { FC } from 'react';
import styles from '../styles/NavBar.module.css';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';

export const NavBarNfts: FC = () => {
    
    const router = useRouter();
    const { publicKey } = useWallet();
    
    const navigateTo = (path: string) => {
        if (!publicKey) {
            alert("Please connect your wallet first!");
        } else {
            router.push(path);
        }
    };

    return (
        <div className={styles.NavBar}>
            <button className={styles.NavButton} onClick={() => navigateTo('/')}>Home</button>
            <button className={styles.NavButton} onClick={() => navigateTo('/office')}>Office</button>
            <button className={styles.NavButton} onClick={() => navigateTo('/farm')}>Farm</button>
        </div>
    );
};
