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

const BIK_AUTH = process.env.BIK_AUTH;
const KRISA_AUTH = process.env.KRISA_AUTH;
const DRAGON_AUTH = process.env.DRAGON_AUTH;
const PERCENT_AUTH = process.env.PERCENT_AUTH;

const isTextValue = (value: any): boolean => typeof value === "string" && isNaN(+value);

const parseTextValue = (value: any): { percentage: number, type: "SelfPoints" | "TeamPoints" | null } => {
  if (typeof value !== "string") return { percentage: 0, type: null };

  const match = value.match(/^(\d+(\.\d+)?)%\s*of\s*(SelfPoints|TeamPoints)$/i);
  if (match) {
      return {
          percentage: Number(match[1]) / 100, // Преобразуем "10%" → 0.1
          type: match[3] as "SelfPoints" | "TeamPoints" // Определяем, к чему относится процент
      };
  }

  return { percentage: 0, type: null }; // Любой другой текст → 0
};

const applyPercentage = (data: { percentage: number; type: "SelfPoints" | "TeamPoints" | null }, selfPoints: number, teamPoints: number): number => {
  if (data.type === "SelfPoints") {
      return selfPoints * data.percentage; // Если процент от личных очков
  } else if (data.type === "TeamPoints") {
      return teamPoints * data.percentage; // Если процент от командных очков
  }
  return 0; // Если нет корректного типа, вернуть 0
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
    nftAuthorityCheck: string,
    playerScore: number,
    teamScore: number
  ): Promise<NftOwnershipResult> => {
    try {
      const savedUpdateAuthority = new PublicKey(nftAuthorityCheck);
      const nftPublicKey = new PublicKey(nftAnimalKey);
      const publicKey = new PublicKey(playerPublicKey);
  
      if (publicKey.toBase58() === nftPublicKey.toBase58() && publicKey.toBase58() === savedUpdateAuthority.toBase58()) {
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

      const isSelfPointsText = isTextValue(selfPointsAttr?.value);
      const isTeamPointsText = isTextValue(teamPointsAttr?.value);

      
      let selfPoints = 0;
      let teamPoints = 0;

      if (isSelfPointsText) {
        const selfPointsData = parseTextValue(selfPointsAttr?.value)
        selfPoints = applyPercentage(selfPointsData, playerScore, teamScore)
      } else {
        selfPoints = selfPointsAttr?.value ? Number(selfPointsAttr.value) || 0 : 0;
      }

      if (isTeamPointsText) {
        const teamPointsData = parseTextValue(teamPointsAttr?.value)
        teamPoints = applyPercentage(teamPointsData, playerScore, teamScore)
      } else {
        teamPoints = selfPointsAttr?.value ? Number(selfPointsAttr.value) || 0 : 0;
      }

      
      // selfPoints = selfPointsAttr?.value ? Number(selfPointsAttr.value) || 0 : 0;
      // teamPoints = selfPointsAttr?.value ? Number(selfPointsAttr.value) || 0 : 0;
  
      console.log(
        `✅ Игрок ${playerPublicKey} владеет NFT ${nftPublicKey.toBase58()}. SelfPoints: ${selfPoints}, TeamPoints: ${teamPoints}, UpdateAuthority: ${updateAuthority}`
      );
  
      return { owned: true, selfPoints, teamPoints, updateAuthority };
    } catch (error) {
      console.error(`❌ Ошибка при проверке владения NFT для ${playerPublicKey}:`, error);
      return { owned: false, selfPoints: 0, teamPoints: 0, updateAuthority: null };
    }
  };


const updateTeamPoints = async (team1Score: number, team2Score: number) => {

    console.log("🛠 Обновление командных очков...");

    try {
        // Получаем игроков с уникальными animalkey (игнорируем дубли)
        const players = await new Promise<any[]>((resolve, reject) => {
            db.all("SELECT publickey, personal_points, team, animalkey, animalkeycontrol FROM users", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        if (players.length === 0) {
            console.log("⚠ Нет игроков для обновления.");
            return;
        }

        const usedNfts = new Set<string>();

        const validNftKeys = new Set([BIK_AUTH, KRISA_AUTH, DRAGON_AUTH, PERCENT_AUTH]);

        // Обрабатываем каждого игрока
        for (const player of players) {
            let selfPoints = 0;
            let teamPoints = 0;

            if (!validNftKeys.has(player.animalkeycontrol) && player.animalkeycontrol !== player.publickey) {
                console.log(`🚫 Игрок ${player.publickey} использует нелегитимный NFT (${player.animalkeycontrol}). Пропускаем.`);
                continue;
            }

            const playerTeamScore = player.team === 1 ? team1Score : team2Score;

            const { owned, selfPoints: nftSelfPoints, teamPoints: nftTeamPoints } = await checkNftOwnership(player.publickey, player.animalkey, player.animalkeycontrol, player.personal_points, playerTeamScore);

            if (owned && usedNfts.has(player.animalkey)) {
                console.log(`⚠ NFT ${player.animalkey} уже использовалась в этом запуске. Пропускаем ${player.publickey}.`);
                continue;
            }

            if (owned) {
                selfPoints = nftSelfPoints;
                teamPoints = nftTeamPoints;
                usedNfts.add(player.animalkey);
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

const getTeamScores = async (): Promise<{ team1Score: number, team2Score: number }> => {
  return new Promise((resolve, reject) => {
      db.all("SELECT id, score FROM teams", (err, rows: any[]) => { // ✅ Используем `any[]` вместо строгих типов
          if (err) {
              console.error("❌ Ошибка при выполнении SELECT запроса:", err);
              reject(err);
              return;
          }

          console.log("🔍 Данные из таблицы teams:", rows); // Отладка

          if (!Array.isArray(rows) || rows.length < 2) {
              reject(new Error("❌ В базе данных недостаточно команд для загрузки очков."));
              return;
          }

          const team1Score = Number(rows[0]?.score) || 0;
          const team2Score = Number(rows[1]?.score) || 0;

          console.log(`✅ Загружены очки команд: Team 1 = ${team1Score}, Team 2 = ${team2Score}`);

          resolve({ team1Score, team2Score });
      });
  });
};

const checkColumnExists = async (columnName: string, tableName: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      db.all(`PRAGMA table_info(${tableName})`, (err, rows: { name: string }[]) => { // ✅ Указываем тип
        if (err) {
          reject(err);
          return;
        }
  
        const columnExists = rows.some((row) => row.name === columnName);
        resolve(columnExists);
      });
    });
  };
  
  
// Подключаем базу данных
const db = new sqlite3.Database("game.db");

// ⚡ Задаем время выполнения (в UTC)
const EXECUTION_HOUR = 14;  // Часы (от 0 до 23)
const EXECUTION_MINUTE = 43; // Минуты (от 0 до 59)


// Функция, которая будет выполняться в заданное время
const dailyFunction = async () => {
    console.log(`✅ Запуск ежедневного задания в ${EXECUTION_HOUR}:${EXECUTION_MINUTE} UTC`);

    // Здесь будет код выполнения задачи (добавим позже)
    const { team1Score, team2Score } = await getTeamScores();
    
    await updateTeamPoints(team1Score, team2Score)

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
