import styles from "../styles/FarmPage.module.css";
import { AppBar } from "../components/AppBar";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Back } from "../components/Back";
import { findNFT } from "../utils/checkForNft";
import { NftStatus } from "../components/NftStatus"; // Новый компонент

const FarmPage = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const checkNft1 = async () => {
    if (!publicKey) return null;
    const result = await findNFT.Bik(connection, publicKey);
    return result?.nftAddress.toBase58() ?? null;
  };

  const checkNft2 = async () => {
    if (!publicKey) return null;
    const result = await findNFT.Rat(connection, publicKey);
    return result?.nftAddress.toBase58() ?? null;
  };

  const checkNft3 = async () => {
    if (!publicKey) return null;
    const result = await findNFT.Dragon(connection, publicKey);
    return result?.nftAddress.toBase58() ?? null;
  };

  return (
    <Back>
      <AppBar />
        <div className={styles.nftContainer}>
          <NftStatus title="NFT 1" checkNft={checkNft1} />
          <NftStatus title="NFT 2" checkNft={checkNft2} />
          <NftStatus title="NFT 3" checkNft={checkNft3} />
        </div>
    </Back>
  );
};

export default FarmPage;
