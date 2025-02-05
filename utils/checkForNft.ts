import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";

// Подключение к Solana
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const metaplex = Metaplex.make(connection);

// 📌 `Mint Address` Master NFT
const MASTER_NFT_MINT = new PublicKey("6umTtienmQxTthD7mUBuvpmanCKU3gNBmBvXC1zYYJkD");

async function findEditionsOfMasterNFT() {
    console.log(`🔍 Ищем копии Master NFT: ${MASTER_NFT_MINT.toBase58()}`);

    // 📌 Получаем Master NFT
    const masterNFT = await metaplex.nfts().findByMint({ mintAddress: MASTER_NFT_MINT });

    console.log("\n✅ Master NFT найден:");
    console.log(`- Name: ${masterNFT.name}`);
    console.log(`- Symbol: ${masterNFT.symbol}`);
    console.log(`- URI: ${masterNFT.uri}`);

    // 📌 Получаем `Current Supply` (количество заминченных копий)
    const editionAccount = await metaplex.nfts().pdas().edition({ mint: MASTER_NFT_MINT });
    const editionData = await connection.getAccountInfo(editionAccount);

    let currentSupply = 0;
    if (editionData && editionData.data.length >= 2) {
        currentSupply = editionData.data[1] || 0; // `Current Supply`
    }

    console.log(`- Current Supply: ${currentSupply}`);

    // 📌 Проверяем, есть ли копии
    if (currentSupply === 0) {
        console.log("\n❌ У Master NFT нет копий.");
        return;
    }

    console.log("\n🔍 Ищем копии через `findAllByMintList()`...");

    // 📌 Получаем все `Mint Addresses` существующих копий через `printNewEdition()`
    const editionPDAs = [];
    for (let i = 1; i <= currentSupply; i++) {
        const editionPDA = await metaplex.nfts().pdas().edition({ mint: MASTER_NFT_MINT });
        editionPDAs.push(editionPDA);
    }

    // 📌 Запрашиваем информацию о найденных копиях
    const editions = await metaplex.nfts().findAllByMintList({ mints: editionPDAs });

    // 📌 Исключаем `null`-значения, если они есть
    const validEditions = editions.filter(edition => edition !== null);

    if (validEditions.length === 0) {
        console.log("\n❌ Копии Master NFT не найдены.");
        return;
    }

    console.log("\n📜 Найденные копии (Editions):");
    validEditions.forEach((edition, index) => {
        console.log(`#${index + 1}: ${edition.address.toBase58()}`);
    });

    console.log(`\n🔍 Всего найдено копий: ${validEditions.length}`);
}

findEditionsOfMasterNFT().catch(console.error);
