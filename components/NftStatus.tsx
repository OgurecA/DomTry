import { useState, useEffect } from "react";
import styles from "../styles/NftStatus.module.css";
import { PublicKey } from "@solana/web3.js";

type NftData = {
  nftAddress: PublicKey;
  nftName: string;
  attributes: { trait_type: string; value: string }[];
} | null;

type NftStatusProps = {
  title: string;
  checkNft: () => Promise<NftData>;
  imageUrl: string; // URL картинки NFT
  onClick: (nft: NftData) => void;
};

export const NftStatus = ({ title, checkNft, imageUrl, onClick }: NftStatusProps) => {
  const [nftData, setNftData] = useState<NftData>(null);
  const [status, setStatus] = useState<0 | 1 | null>(0);
  const [hover, setHover] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const fetchNft = async () => {
      try {
        setStatus(0); // Начинаем загрузку
        const result = await checkNft();
        if (result) {
          setNftData(result);
          setStatus(1); // NFT найдена
        } else {
          setStatus(null); // NFT не найдена
        }
      } catch (error) {
        console.error(`Ошибка загрузки ${title}:`, error);
        setStatus(null);
      }
    };

    fetchNft();
  }, [checkNft]);

  // Обновляем позицию всплывающего окна при движении мыши
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipPosition({ 
      x: e.clientX - rect.left + 10, 
      y: e.clientY - rect.top + 10
    });
  };
  

  const allowedAttributes = ["Occupation", "TeamPoints", "SelfPoints"];

  if (status === null) return null;

  return (
    <div
      className={styles.nftContainer}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={handleMouseMove}
      onClick={() => nftData && onClick(nftData)}
    >
      {status === 0 ? (
        <div className={styles.loader}></div> // Анимация загрузки
      ) : (
        <img src={imageUrl} alt={title} className={styles.nftImage} />
      )}

      {hover && nftData && !isMobileLayout && (
        <div
          className={styles.tooltip}
          style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
        >
          <p><strong>Название:</strong> {nftData.nftName}</p>
          <ul className={styles.attributeList}>
            {nftData.attributes.length > 0 ? (
              nftData.attributes
              .filter(attr => allowedAttributes.includes(attr.trait_type))
              .map((attr, index) => (
                <li key={index}>
                  <strong>{attr.trait_type}:</strong> {attr.value}
                </li>
              ))
            ) : (
              <li>Нет атрибутов</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
