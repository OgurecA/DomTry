import { useState, useEffect } from "react";
import styles from "../styles/NftStatus.module.css";

type NftData = {
  nftAddress: string;
  name: string;
  attributes: { trait_type: string; value: string }[];
} | null;

type NftStatusProps = {
  title: string;
  checkNft: () => Promise<NftData>;
};

export const NftStatus = ({ title, checkNft }: NftStatusProps) => {
  const [nftData, setNftData] = useState<NftData>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNft = async () => {
      try {
        setIsLoading(true);
        const result = await checkNft();
        setNftData(result);
      } catch (error) {
        console.error(`Ошибка загрузки ${title}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNft();
  }, [checkNft]);

  return (
    <div className={styles.nftContainer}>
      <p className={styles.nftTitle}>{title}</p>
      
      {isLoading ? (
        <div className={styles.loader}></div> // Анимация загрузки
      ) : nftData ? (
        <div className={styles.nftDetails}>
          <p><strong>Название:</strong> {nftData.name}</p>
          <p><strong>Адрес:</strong> {nftData.nftAddress}</p>
          
          <p><strong>Атрибуты:</strong></p>
          <ul className={styles.attributeList}>
            {nftData.attributes.length > 0 ? (
              nftData.attributes.map((attr, index) => (
                <li key={index}>
                  <strong>{attr.trait_type}:</strong> {attr.value}
                </li>
              ))
            ) : (
              <li>Нет атрибутов</li>
            )}
          </ul>
        </div>
      ) : (
        <p className={styles.error}>❌ NFT не найдена</p>
      )}
    </div>
  );
};
