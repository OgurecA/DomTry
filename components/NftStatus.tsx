import { useState, useEffect } from "react";
import styles from "../styles/NftStatus.module.css"; // Стили для иконок и анимации

type NftStatusProps = {
  title: string;
  checkNft: () => Promise<string | null>; // Функция для проверки NFT
};

export const NftStatus = ({ title, checkNft }: NftStatusProps) => {
  const [status, setStatus] = useState<number | string | null>(0); // 0 = загрузка

  useEffect(() => {
    const fetchNft = async () => {
      try {
        const result = await checkNft();
        setStatus(result ?? null); // Если null, сохраняем null
      } catch (error) {
        console.error(`Ошибка проверки ${title}:`, error);
        setStatus(null);
      }
    };

    fetchNft();
  }, [checkNft]);

  return (
    <div className={styles.nftIcon}>
      <p>{title}</p>
      {status === 0 ? (
        <div className={styles.loader}></div> // Анимация загрузки
      ) : (
        <span>{status}</span>
      )}
    </div>
  );
};
