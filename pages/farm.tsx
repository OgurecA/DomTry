import { useState, useEffect } from "react";
import styles from "../styles/FarmPage.module.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Back } from "../components/Back";
import { findNFT } from "../utils/checkForNft";
import { NftStatus } from "../components/NftStatus"; 
import { FarmAppBar } from "../components/FarmAppBar";
import { PublicKey } from "@solana/web3.js";

const allowedAttributes = ["Species", "TeamPoints", "SelfPoints"];

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
                selectedNft.attributes
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
        {selectedNft && (
        <div className={styles.selectedNftDescriptionContainer}>
          <h2>
            {selectedNft.attributes.find(attr => attr.trait_type === "Occupation")?.value || "Нет данных"}
          </h2>
          <p>{selectedNft.attributes.find(attr => attr.trait_type === "Description")?.value || "Нет данных"}</p>
          <button className={styles.selectedNftButton}>
            SET
          </button>
        </div>
        )}

        <div className={styles.nftWrapper}>
          <NftStatus
            title="BERNARD"
            imageUrl="/BekPNG.png"
            checkNft={() => Promise.resolve(nfts.nft1)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/BekPNG.png" })}
          />
          <NftStatus
            title="olev"
            imageUrl="/Krisa.png"
            checkNft={() => Promise.resolve(nfts.nft2)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Krisa.png" })}
          />
          <NftStatus
            title="UNICHTOZHITEL"
            imageUrl="/BarsukNewPNG.png"
            checkNft={() => Promise.resolve(nfts.nft3)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/BarsukNewPNG.png" })}
          />
        </div>
      </Back>
    </>
  );
};

export default FarmPage;
