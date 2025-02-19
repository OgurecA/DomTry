import { FC, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

export const FarmAppBar: FC = () => {

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
        <div className={styles.AppHeaderFarm}>
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
