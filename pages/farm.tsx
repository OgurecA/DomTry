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
