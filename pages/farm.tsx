import { useState, useEffect } from "react";
import styles from "../styles/FarmPage.module.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { findNFT } from "../utils/checkForNft";
import { NftStatus } from "../components/NftStatus"; 
import { FarmAppBar } from "../components/FarmAppBar";
import { PublicKey } from "@solana/web3.js";
import { BackOffice } from "../components/BackOffice";
import { NavBarFarm } from "../components/NavBarFarm";

const allowedAttributes = ["Species", "TeamPoints", "SelfPoints"];

type NftData = {
  nftAddress: PublicKey;
  nftName: string;
  attributes: { trait_type: string; value: string }[];
  nftCreator: string;
  imageUrl: string;
} | null;


const FarmPage = () => {

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [nfts, setNfts] = useState<{ player: NftData, nft1: NftData, nft2: NftData, nft3: NftData }>({
    player: null,
    nft1: null,
    nft2: null,
    nft3: null,
  });

  const [selectedNft, setSelectedNft] = useState<NftData>(null);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);

  const [playerAvatar, setPlayerAvatar] = useState<NftData>(null);

  const [animalKey, setAnimalKey] = useState<string | null>(null);

  const getStatus = (nft: NftData | null) => {
    return nft && nft.nftAddress.toBase58() === animalKey ? "CHOSEN" : "SET";
  };

  const [isMobileLayout, setIsMobileLayout] = useState<boolean | null>(false);
  const [isMobileLayout2, setIsMobileLayout2] = useState<boolean | null>(false);

  useEffect(() => {
    const handleResize = () => {
        setIsMobileLayout(window.innerWidth < 1170);
    };

    // Вызываем сразу при загрузке
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
        setIsMobileLayout2(window.innerWidth < 780);
    };

    // Вызываем сразу при загрузке
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
      imageUrl: "/Avatar.png", // Заглушка для аватара
      nftCreator: publicKey.toBase58()
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

      setNfts({
        player: playerAvatar ?? null,
        nft1: nft1 ? { ...nft1, imageUrl: "/BekPNG.png" } : null,
        nft2: nft2 ? { ...nft2, imageUrl: "/Krisa.png" } : null,
        nft3: nft3 ? { ...nft3, imageUrl: "/BarsukNewPNG.png" } : null,
      });
    };
    fetchNfts();
  }, [publicKey, connection, playerAvatar]);

  
  useEffect(() => {
    if (!publicKey) return;

    const fetchAnimalKey = async () => {
      try {
        const response = await fetch("/api/getanimal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicKey: publicKey.toBase58() }),
        });

        const result = await response.json();
        if (response.ok && result.animalKey) {
          setAnimalKey(result.animalKey);
        } else {
          console.log("⚠ Нет animalKey у пользователя.", publicKey.toBase58());
        }
      } catch (error) {
        console.error("❌ Ошибка при запросе animalKey:", error);
      }
    };

    fetchAnimalKey();
  }, [publicKey]);
  

  useEffect(() => {
    if (!animalKey) return;

    const foundNft = [nfts.player, nfts.nft1, nfts.nft2, nfts.nft3].find(
      (nft) => nft && nft.nftAddress.toBase58() === animalKey
    );

    setSelectedNft(foundNft ?? playerAvatar);
  }, [animalKey, nfts, playerAvatar]);
  
  

  const setAnimal = async () => {
      if (!selectedNft) return;
      try {
        setButtonIsLoading(true);
        // Отправляем пользователя в БД
        const response = await fetch('/api/setanimal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicKey: publicKey.toBase58(),
            animalKey: selectedNft.nftAddress.toBase58(),
            nftCreator: selectedNft.nftCreator,
            animalUrl: selectedNft.imageUrl
          }),
        });
    
        const result = await response.json();
        if (response.ok) {
          console.log("✅ Обновлен в БД:", result);
          setAnimalKey(selectedNft.nftAddress.toBase58())
        } else {
          console.error("❌ Ошибка при обновлении в БД:", result.message);
        }
      } catch (error) {
        console.error("❌ Ошибка в setAnimal:", error)
      } finally {
        setButtonIsLoading(false); // ✅ Выключаем загрузку после ответа (успех/ошибка)
      }
    };

  

  return (
    <>
      <FarmAppBar />
      <BackOffice>
      {isMobileLayout2 && (<NavBarFarm />)}
        <div className={styles.selectedNftContainer}>
          {selectedNft && (
            <img src={selectedNft.imageUrl} alt={selectedNft.nftName} className={styles.selectedNftImage} />
          )}
        </div>
        
        {selectedNft && (
        <div className={styles.selectedNftInfoContainer}>
            <h2>{selectedNft.nftName}</h2>
            <p>
            <strong>Адрес:</strong> {!isMobileLayout ?
              selectedNft.nftAddress.toBase58() :
              `${selectedNft.nftAddress.toBase58().slice(0, 4)}...${selectedNft.nftAddress.toBase58().slice(-4)}`}
            </p>

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
        {selectedNft && isMobileLayout2 && (
          <button className={styles.selectedNftButton} onClick={() => setAnimal()} disabled={buttonIsLoading}>
            {buttonIsLoading ? <span className={styles.loader}></span> : getStatus(selectedNft)}
          </button>
        )}
        {selectedNft && !isMobileLayout2 && (
        <div className={styles.selectedNftDescriptionContainer}>
          <h2>
            {selectedNft.attributes.find(attr => attr.trait_type === "Occupation")?.value || "Нет данных"}
          </h2>
          <p>{selectedNft.attributes.find(attr => attr.trait_type === "Description")?.value || "Нет данных"}</p>
          <button className={styles.selectedNftButton} onClick={() => setAnimal()} disabled={buttonIsLoading}>
            {buttonIsLoading ? <span className={styles.loader}></span> : getStatus(selectedNft)}
          </button>
        </div>
        )}
        {isMobileLayout2 ? (
          <div className={styles.scrollableContainer}>
          <div className={styles.nftWrapper}>
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
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
          </div>
        ) : (
          <div className={styles.nftWrapper}>
            <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
          <NftStatus
            title="PLAYER"
            imageUrl="/Avatar.png"
            checkNft={() => Promise.resolve(playerAvatar)}
            onClick={(nft) => setSelectedNft({ ...nft, imageUrl: "/Avatar.png" })}
          />
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
        )}
      </BackOffice>
    </>
  );
};

export default FarmPage;
