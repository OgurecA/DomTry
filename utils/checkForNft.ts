import { Metadata, Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const BIK_AUTH = process.env.BIK_AUTH;
const KRISA_AUTH = process.env.KRISA_AUTH;
const DRAGON_AUTH = process.env.DRAGON_AUTH;

export class findNFT {

    static async Bik(
        connection: Connection,
        walletAddress: PublicKey,
      ): Promise<{ nftAddress: PublicKey; nftName: string; attributes: any[] | null } | null> {
        const metaplex = Metaplex.make(connection);
        try {
            const ownerPubKey = new PublicKey(walletAddress);
      
            console.log("🔍 Ищем NFT...");
            const assets = await metaplex.nfts().findAllByOwner({ owner: ownerPubKey });
      
            // Фильтруем только Metadata
            const metadataAssets = assets.filter(asset => asset.model === "metadata") as Metadata[];
      
            for (let i = 0; i < metadataAssets.length; i++) {
                const metadata = metadataAssets[i];
      
                // Добавляем задержку, чтобы избежать 429
                await delay(200);
      
                // Загружаем полные данные NFT
                const nft = await metaplex.nfts().load({ metadata });
      
                if (nft.updateAuthorityAddress.toBase58() === BIK_AUTH) {
                    console.log(`🎯 Найдена NFT с updateAuthority ${BIK_AUTH}:`);
                    console.log(`✅ Mint: ${nft.address.toBase58()}`);
                    
                    const nftName = nft.name;
                    const attributes = nft.json?.attributes || [];

                    return {
                        nftAddress: nft.address,
                        nftName,
                        attributes
                    };
                }
            }
      
            console.log("❌ NFT с таким updateAuthority не найдены.", BIK_AUTH);
            return null;
      
        } catch (error) {
            console.error("❌ Ошибка получения NFT:", (error as Error).message);
            return null;
        }
      }

      static async Rat(
        connection: Connection,
        walletAddress: PublicKey,
      ): Promise<{ nftAddress: PublicKey; nftName: string; attributes: any[] | null } | null> {
        const metaplex = Metaplex.make(connection);
        try {
            const ownerPubKey = new PublicKey(walletAddress);
      
            console.log("🔍 Ищем NFT...");
            const assets = await metaplex.nfts().findAllByOwner({ owner: ownerPubKey });
      
            // Фильтруем только Metadata
            const metadataAssets = assets.filter(asset => asset.model === "metadata") as Metadata[];
      
            for (let i = 0; i < metadataAssets.length; i++) {
                const metadata = metadataAssets[i];
      
                // Добавляем задержку, чтобы избежать 429
                await delay(200);
      
                // Загружаем полные данные NFT
                const nft = await metaplex.nfts().load({ metadata });
      
                if (nft.updateAuthorityAddress.toBase58() === KRISA_AUTH) {
                    console.log(`🎯 Найдена NFT с updateAuthority ${KRISA_AUTH}:`);
                    console.log(`✅ Mint: ${nft.address.toBase58()}`);
                    
                    const nftName = nft.name;
                    const attributes = nft.json?.attributes || [];

                    return {
                        nftAddress: nft.address,
                        nftName,
                        attributes
                    };
                }
            }
      
            console.log("❌ NFT с таким updateAuthority не найдены.", KRISA_AUTH);
            return null;
      
        } catch (error) {
            console.error("❌ Ошибка получения NFT:", (error as Error).message);
            return null;
        }
      }

      static async Dragon(
        connection: Connection,
        walletAddress: PublicKey,
      ): Promise<{ nftAddress: PublicKey; nftName: string; attributes: any[] | null } | null> {
        const metaplex = Metaplex.make(connection);
        try {
            const ownerPubKey = new PublicKey(walletAddress);
      
            console.log("🔍 Ищем NFT...");
            const assets = await metaplex.nfts().findAllByOwner({ owner: ownerPubKey });
      
            // Фильтруем только Metadata
            const metadataAssets = assets.filter(asset => asset.model === "metadata") as Metadata[];
      
            for (let i = 0; i < metadataAssets.length; i++) {
                const metadata = metadataAssets[i];
      
                // Добавляем задержку, чтобы избежать 429
                await delay(200);
      
                // Загружаем полные данные NFT
                const nft = await metaplex.nfts().load({ metadata });
      
                if (nft.updateAuthorityAddress.toBase58() === DRAGON_AUTH) {
                    console.log(`🎯 Найдена NFT с updateAuthority ${DRAGON_AUTH}:`);
                    console.log(`✅ Mint: ${nft.address.toBase58()}`);
                    
                    const nftName = nft.name;
                    const attributes = nft.json?.attributes || [];

                    return {
                        nftAddress: nft.address,
                        nftName,
                        attributes
                    };
                }
            }
      
            console.log("❌ NFT с таким updateAuthority не найдены.", DRAGON_AUTH);
            return null;
      
        } catch (error) {
            console.error("❌ Ошибка получения NFT:", (error as Error).message);
            return null;
        }
      }

}