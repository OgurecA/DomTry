import { useState, useEffect } from "react";
import styles from "../styles/FarmPage.module.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Back } from "../components/Back";
import { findNFT } from "../utils/checkForNft";
import { NftStatus } from "../components/NftStatus"; 
import { FarmAppBar } from "../components/FarmAppBar";
import { PublicKey } from "@solana/web3.js";


type NftData = {
  nftAddress: PublicKey;
  nftName: string;
  attributes: { trait_type: string; value: string }[];
  imageUrl: string;
} | null;


const FarmPage = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<{ nft1: any, nft2: any, nft3: any }>({
    nft1: null,
    nft2: null,
    nft3: null,
  });

  const [selectedNft, setSelectedNft] = useState<NftData>(null);

  useEffect(() => {
    if (!publicKey) return;

    const fetchNfts = async () => {
      const [nft1, nft2, nft3] = await Promise.all([
        findNFT.Bik(connection, publicKey),
        findNFT.Rat(connection, publicKey),
        findNFT.Dragon(connection, publicKey),
      ]);

      setNfts({ nft1, nft2, nft3 });
    };

    fetchNfts();
  }, [publicKey, connection]);

  return (
    <>
      <FarmAppBar />
      <Back>
        <div className={styles.selectedNftContainer}>
          {selectedNft && (
            <img src={selectedNft.imageUrl} alt={selectedNft.nftName} className={styles.selectedNftImage} />
          )}
        </div>
        
        {selectedNft && (
        <div className={styles.selectedNftInfoContainer}>
            <h2>{selectedNft.nftName}</h2>
            <p><strong>Адрес:</strong> {selectedNft.nftAddress.toBase58()}</p>
            <h3>Атрибуты:</h3>
            <ul className={styles.attributeList}>
              {selectedNft.attributes.length > 0 ? (
                selectedNft.attributes.map((attr, index) => (
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
        {selectedNft && (
        <div className={styles.selectedNftDescriptionContainer}>
          <h2>{selectedNft.nftName}</h2>
          <p>большое колвлаошщвошщьваощиьвоатиовщ шщвщп шщшщ ушщ шщтшщт шщвтвшщ тшщпт шщатщпвт щптво твошт от ощвто твш тшт втп шт ошвт овтп олто твотп овто ватпотво т тотощтвощтпощатощ тощвт ощтощ тваощп ощвт овттпощвтпотповвт ощво щтвощ то прттот отт овщ овваат ощвао текста</p>
        </div>
        )}

        <div className={styles.nftWrapper}>
          <NftStatus
            title="BERNARD"
            imageUrl="/BarsukNewPNG.png"
            checkNft={() => Promise.resolve(nfts.nft1)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/BarsukNewPNG.png" })}
          />
          <NftStatus
            title="olev"
            imageUrl="/BekPNG.png"
            checkNft={() => Promise.resolve(nfts.nft2)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/BekPNG.png" })}
          />
          <NftStatus
            title="UNICHTOZHITEL"
            imageUrl="/Krisa.png"
            checkNft={() => Promise.resolve(nfts.nft3)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Krisa.png" })}
          />
        </div>
      </Back>
    </>
  );
};

export default FarmPage;
