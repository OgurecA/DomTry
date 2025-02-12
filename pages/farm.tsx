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
  const [nfts, setNfts] = useState<{ player: any, nft1: any, nft2: any, nft3: any }>({
    player: null,
    nft1: null,
    nft2: null,
    nft3: null,
  });

  const [selectedNft, setSelectedNft] = useState<NftData>(null);

  const [playerAvatar, setPlayerAvatar] = useState<NftData>(null);

  const [animalStatus, setAnimalStatus] = useState<String>("SET");
  const [setting, setSetting] = useState<String>("SET");
  const [animalKey, setAnimalKey] = useState<string | null>(null);

  const getStatus = (nft: NftData | null) => {
    if (!nft) return "SET";
    return nft.nftAddress.toBase58() === animalKey ? "CHOSEN" : "SET";
  };


  useEffect(() => {
    if (!publicKey) return;
  
    const avatar = {
      nftAddress: publicKey, // Делаем его "NFT"
      nftName: "PLAYER",
      attributes: [
        { trait_type: "Species", value: "Human" },
        { trait_type: "Occupation", value: "Kurjer" },
        { trait_type: "TeamPoints", value: "1" },
        { trait_type: "SelfPoints", value: "1" },
        { trait_type: "Description", value: "prosto chelovek" }
      ],
      imageUrl: "/Avatar.png" // Заглушка для аватара
    };
  
    setPlayerAvatar(avatar);
  }, [publicKey, connection]); // Запускается при изменении `publicKey`


  useEffect(() => {
    if (!publicKey) return;

    const fetchNfts = async () => {
      const [nft1, nft2, nft3] = await Promise.all([
        findNFT.Bik(connection, publicKey),
        findNFT.Rat(connection, publicKey),
        findNFT.Dragon(connection, publicKey),
      ]);

      setNfts({ player: playerAvatar, nft1, nft2, nft3 });
    };
    fetchAnimalKey()
    fetchNfts();
  }, [publicKey, connection]);

  
  // Отдельный `useEffect`, чтобы `selectedNft` обновился после `playerAvatar`
  useEffect(() => {
    if (!animalKey) return;
  
    // Ищем среди всех NFT
    const foundNft = [playerAvatar, nfts.nft1, nfts.nft2, nfts.nft3].find(
      (nft) => nft && nft.nftAddress.toBase58() === animalKey
    );
  
    if (foundNft) {
      setSelectedNft(foundNft);
    } else {
      setSelectedNft(playerAvatar)
    }
  }, [animalKey]);
   // Запускается при изменении `playerAvatar`
  
  
  
  const fetchAnimalKey = async () => {
    if (!publicKey) return;
    try {
      const response = await fetch("/api/getanimal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
      });

      const result = await response.json();
      if (response.ok && result.animalKey) {
        setAnimalKey(result.animalKey); // Сохраняем animalKey
      } else {
        console.log("⚠ Нет animalKey у пользователя.");
      }
    } catch (error) {
      console.error("❌ Ошибка при запросе animalKey:", error);
    }
  };


  const setAnimal = async () => {
      if (!selectedNft) return;
      try {
        setAnimalStatus("CHECKING...")
        setAnimalKey(selectedNft.nftAddress.toBase58());
        
        // Отправляем пользователя в БД
        const response = await fetch('/api/setanimal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicKey: publicKey.toBase58(),
            animalKey: selectedNft.nftAddress.toBase58(),
          }),
        });
    
        const result = await response.json();
        if (response.ok) {
          console.log("✅ Обновлен в БД:", result);
          setAnimalStatus("CHOSEN")
        } else {
          console.error("❌ Ошибка при обновлении в БД:", result.message);
          setAnimalStatus("SET")
        }
      } catch (error) {
        console.error("❌ Ошибка в setAnimal:", error)
        setAnimalStatus("SET");
      }
    };

  

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
          <button className={styles.selectedNftButton} onClick={() => setAnimal()}>
            {getStatus(selectedNft) ? "CHOSEN" : "SET"}
          </button>
        </div>
        )}

        <div className={styles.nftWrapper}>
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
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
