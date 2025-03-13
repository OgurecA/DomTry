import { Metadata, Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";
dotenv.config();


// Настройки подключения к Solana
const SOLANA_RPC_URL = "https://api.devnet.solana.com"; // или свой RPC
const connection = new Connection(SOLANA_RPC_URL);

// Подключение Metaplex
const metaplex = Metaplex.make(connection);


// Функция для получения метаданных и атрибутов NFT
const getNftAttributes = async (nftPublicKey: PublicKey) => {
    try {
        const nftMetadata = await metaplex.nfts().findByMint({ mintAddress: nftPublicKey });

        if (!nftMetadata || !nftMetadata.json) {
            console.log(`⚠ Метаданные для ${nftPublicKey.toBase58()} не найдены`);
            return null;
        }

        // Извлекаем атрибуты
        const attributes = nftMetadata.json.attributes || [];

        console.log(`✅ NFT ${nftPublicKey.toBase58()} найдено. Атрибуты:`, attributes);
        return attributes;
    } catch (error) {
        console.error(`❌ Ошибка при получении NFT ${nftPublicKey.toBase58()}:`, error);
        return null;
    }
};

type NftOwnershipResult = {
    owned: boolean;
    selfPoints: number;
    teamPoints: number;
    updateAuthority: string | null;
  };

  const checkNftOwnership = async (
    playerPublicKey: string,
    nftAnimalKey: string,
    nftAuthorityCheck: string
  ): Promise<NftOwnershipResult> => {
    try {
      const savedUpdateAuthority = new PublicKey(nftAuthorityCheck);
      const nftPublicKey = new PublicKey(nftAnimalKey);
      const publicKey = new PublicKey(playerPublicKey);
  
      if (publicKey === nftPublicKey && publicKey === savedUpdateAuthority) {
        console.log(`⚠ Игрок ${playerPublicKey} не использует NFT`);
        return { owned: false, selfPoints: 1, teamPoints: 1, updateAuthority: null };
    }
    
      // Проверяем, владеет ли игрок NFT
      const assets = await metaplex.nfts().findAllByOwner({ owner: publicKey });
      
      const metadataAssets = assets.filter(asset => asset.model === "metadata") as Metadata[];
      const nft = metadataAssets.find(asset => asset.mintAddress.equals(nftPublicKey));
      if (!nft) {
        console.log(`⚠ Игрок ${playerPublicKey} не владеет NFT ${nftPublicKey.toBase58()}`);
        return { owned: false, selfPoints: 0, teamPoints: 0, updateAuthority: null };
      }
  
      // Загружаем полные метаданные NFT
      const nftMetadata = await metaplex.nfts().findByMint({ mintAddress: nftPublicKey });
      if (!nftMetadata || !nftMetadata.json) {
        console.log(`⚠ Метаданные для ${nftPublicKey.toBase58()} не найдены`);
        return { owned: true, selfPoints: 0, teamPoints: 0, updateAuthority: null };
      }
  
      // Проверяем updateAuthority
      const updateAuthority = nftMetadata.updateAuthorityAddress?.toBase58() || null;
      if (!updateAuthority || updateAuthority !== savedUpdateAuthority.toBase58()) {
        console.log(
          `⚠ updateAuthority для ${nftPublicKey.toBase58()} (${updateAuthority}) не совпадает с ожидаемым (${savedUpdateAuthority.toBase58()})`
        );
        return { owned: true, selfPoints: 0, teamPoints: 0, updateAuthority: null };
      }
  
      // Извлекаем атрибуты
      const attributes = nftMetadata.json.attributes || [];
      const selfPointsAttr = attributes.find(attr => attr.trait_type === "SelfPoints");
      const teamPointsAttr = attributes.find(attr => attr.trait_type === "TeamPoints");
  
      const selfPoints = selfPointsAttr?.value ? Number(selfPointsAttr.value) || 0 : 0;
      const teamPoints = teamPointsAttr?.value ? Number(teamPointsAttr.value) || 0 : 0;
  
      // Проверка на допустимые значения
      if (selfPoints < 0 || selfPoints > 1000 || teamPoints < 0 || teamPoints > 1000) {
        console.log(
          `⚠ Недопустимые значения атрибутов для NFT ${nftPublicKey.toBase58()}: SelfPoints=${selfPoints}, TeamPoints=${teamPoints}`
        );
        return { owned: true, selfPoints: 0, teamPoints: 0, updateAuthority };
      }
  
      console.log(
        `✅ Игрок ${playerPublicKey} владеет NFT ${nftPublicKey.toBase58()}. SelfPoints: ${selfPoints}, TeamPoints: ${teamPoints}, UpdateAuthority: ${updateAuthority}`
      );
  
      return { owned: true, selfPoints, teamPoints, updateAuthority };
    } catch (error) {
      console.error(`❌ Ошибка при проверке владения NFT для ${playerPublicKey}:`, error);
      return { owned: false, selfPoints: 0, teamPoints: 0, updateAuthority: null };
    }
  };


const updateTeamPoints = async () => {
    console.log("🛠 Обновление командных очков...");

    try {
        // Получаем игроков с уникальными animalkey (игнорируем дубли)
        const players = await new Promise<any[]>((resolve, reject) => {
            db.all("SELECT publickey, team, animalkey, animalkeycontrol FROM users", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        if (players.length === 0) {
            console.log("⚠ Нет игроков для обновления.");
            return;
        }


        // Обрабатываем каждого игрока
        for (const player of players) {
            let selfPoints = 0;
            let teamPoints = 0;

            const { owned, selfPoints: nftSelfPoints, teamPoints: nftTeamPoints } = await checkNftOwnership(player.publickey, player.animalkey, player.animalkeycontrol);

            if (owned) {
                selfPoints = nftSelfPoints;
                teamPoints = nftTeamPoints;
            } else if (player.animalkeycontrol === player.publickey) {
                selfPoints = 1;
                teamPoints = 1;
            } else {
                console.log(`⚠ Игрок ${player.publickey} не имеет NFT. Пропускаем.`);
                continue;
            }

            // Обновляем данные игрока
            await new Promise((resolve, reject) => {
                db.run(
                    "UPDATE users SET personal_points = personal_points + ?, team_points = team_points + ?, animalkey = ?, animalkeycontrol = ?, animal_image = ? WHERE publickey = ?",
                    [selfPoints, teamPoints, player.publickey, player.publickey, "/Avatar.png", player.publickey],
                    function (err) {
                        if (err) reject(err);
                        else resolve(null);
                    }
                );
            });

            // Добавляем очки команде
            await new Promise((resolve, reject) => {
                db.run(
                    "UPDATE teams SET score = score + ? WHERE id = ?",
                    [teamPoints, player.team],
                    function (err) {
                        if (err) reject(err);
                        else resolve(null);
                    }
                );
            });

            console.log(`✅ Игрок ${player.publickey}: +${selfPoints} SelfPoints, +${teamPoints} TeamPoints.`);
        }

        console.log("✅ Все очки обновлены!");

    } catch (error) {
        console.error("❌ Ошибка при обновлении очков:", error);
    }
};

// Подключаем базу данных
const db = new sqlite3.Database("game.db");

// ⚡ Задаем время выполнения (в UTC)
const EXECUTION_HOUR = 13;  // Часы (от 0 до 23)
const EXECUTION_MINUTE = 57; // Минуты (от 0 до 59)


// Функция, которая будет выполняться в заданное время
const dailyFunction = async () => {
    console.log(`✅ Запуск ежедневного задания в ${EXECUTION_HOUR}:${EXECUTION_MINUTE} UTC`);

    // Здесь будет код выполнения задачи (добавим позже)
    
    updateTeamPoints()


    console.log("✅ Ежедневное задание завершено");
};

// Функция вычисляет, сколько миллисекунд осталось до заданного времени
const getMillisecondsUntilExecution = (): number => {
    const now = new Date();
    const nextExecution = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        EXECUTION_HOUR,
        EXECUTION_MINUTE,
        0,
        0
    ));

    // Если время уже прошло сегодня, берем следующее выполнение завтра
    if (now >= nextExecution) {
        nextExecution.setUTCDate(nextExecution.getUTCDate() + 1);
    }

    return nextExecution.getTime() - now.getTime();
};

// Запускаем таймер
const scheduleDailyTask = () => {
    const timeUntilExecution = getMillisecondsUntilExecution();

    console.log(`⏳ Следующее выполнение задачи через ${Math.round(timeUntilExecution / 1000 / 60)} минут`);

    // Устанавливаем setTimeout для первого запуска
    setTimeout(() => {
        dailyFunction();
        // После первого выполнения устанавливаем запуск раз в сутки (24 часа)
        setInterval(dailyFunction, 1 * 60 * 1000);
    }, timeUntilExecution);
};

// Запускаем задачу при старте сервера
scheduleDailyTask();
