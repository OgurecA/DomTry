import { FC } from 'react';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

export const FarmAppBar: FC = () => {

    const router = useRouter();
    
    const navigateTo = (path: string) => {
        router.push(path);
    };

    return (
        <div className={styles.AppHeader}>
            <div className={styles.LeftSection}>
                <button className={styles.BackButton} onClick={() => router.replace("/")}></button>
                <button className={styles.NavButton}>NFT</button>
                <button className={styles.NavButton} onClick={() => router.replace("/office")}>OFFICE</button>
            </div>
            <div className={styles.RightSection}>
            </div>
        </div>
    );
};
