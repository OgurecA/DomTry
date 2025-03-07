import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import sqlite3 from "sqlite3";

// Настройки подключения к Solana
const SOLANA_RPC_URL = "https://api.devnet.solana.com"; // или свой RPC
const connection = new Connection(SOLANA_RPC_URL);

// Подключение Metaplex
const metaplex = Metaplex.make(connection);

// Список NFT-адресов (публичные ключи)
const NFT_PUBLIC_KEYS = [
    "oLEyYPH98oYZQjzXLSXvV9L2Pcr2tPQbPfnYA1EFEF8", 
    "2c7rWrzkNuFYARxKxYS71SQZZaRsVxxoSVKcp8mdptg5", 
    "BpP4tmSJ3XNzpyEEmrbrUjotDx38weao9NMskeFRd9tY"
].map(key => new PublicKey(key));

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

// Основная функция для поиска 3 NFT
const fetchNftsAttributes = async () => {
    console.log("🔍 Поиск атрибутов для 3 NFT...");
    
    const results = await Promise.all(NFT_PUBLIC_KEYS.map(getNftAttributes));

    if (!results || results.length !== 3) {
        console.error("❌ Ошибка: Данные NFT не загружены корректно");
        return;
    }

    // Извлекаем значения TeamPoints и SelfPoints для каждой NFT
    const [bikAttributes, krisaAttributes, dragonAttributes] = results;

    const getAttributeValue = (attributes: any[], traitType: string): number => {
        const foundAttribute = attributes.find(attr => attr.trait_type === traitType);
        return foundAttribute ? Number(foundAttribute.value) || 0 : 0;
    };

    // Создаем переменные для хранения значений
    const bikSelfPoints = getAttributeValue(bikAttributes, "SelfPoints");
    const bikTeamPoints = getAttributeValue(bikAttributes, "TeamPoints");

    const krisaSelfPoints = getAttributeValue(krisaAttributes, "SelfPoints");
    const krisaTeamPoints = getAttributeValue(krisaAttributes, "TeamPoints");

    const dragonSelfPoints = getAttributeValue(dragonAttributes, "SelfPoints");
    const dragonTeamPoints = getAttributeValue(dragonAttributes, "TeamPoints");

    console.log("✅ Значения получены:");
    console.log(`Bik - SelfPoints: ${bikSelfPoints}, TeamPoints: ${bikTeamPoints}`);
    console.log(`Krisa - SelfPoints: ${krisaSelfPoints}, TeamPoints: ${krisaTeamPoints}`);
    console.log(`Dragon - SelfPoints: ${dragonSelfPoints}, TeamPoints: ${dragonTeamPoints}`);

    return {
        bik: { selfPoints: bikSelfPoints, teamPoints: bikTeamPoints },
        krisa: { selfPoints: krisaSelfPoints, teamPoints: krisaTeamPoints },
        dragon: { selfPoints: dragonSelfPoints, teamPoints: dragonTeamPoints },
    };
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

        const animalKeyCounts = players.reduce((acc, player) => {
            acc[player.animalkey] = (acc[player.animalkey] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Оставляем только игроков с **уникальным** `animalkey`
        const uniquePlayers = players.filter(player => animalKeyCounts[player.animalkey] === 1);

        console.log(`✅ Уникальных игроков после фильтрации: ${uniquePlayers.length}`);

        if (uniquePlayers.length === 0) {
            console.log("⚠ Нет уникальных игроков после фильтрации дубликатов.");
            return;
        }

        // Загружаем атрибуты NFT
        const { bik, krisa, dragon } = await fetchNftsAttributes();

        // Обрабатываем каждого игрока
        for (const player of uniquePlayers) {
            let selfPoints = 0;
            let teamPoints = 0;

            if (player.animalkeycontrol === BIK_AUTH) {
                selfPoints = bik.selfPoints;
                teamPoints = bik.teamPoints;
            } else if (player.animalkeycontrol === KRISA_AUTH) {
                selfPoints = krisa.selfPoints;
                teamPoints = krisa.teamPoints;
            } else if (player.animalkeycontrol === DRAGON_AUTH) {
                selfPoints = dragon.selfPoints;
                teamPoints = dragon.teamPoints;
            } else if (player.animalkeycontrol === player.publickey) {
                selfPoints = 1;
                teamPoints = 1;
            } else {
                console.log(`⚠ Игрок ${player.publickey} не связан с известными NFT.`);
                continue;
            }

            // Обновляем данные игрока
            await new Promise((resolve, reject) => {
                db.run(
                    "UPDATE users SET personal_points = personal_points + ?, team_points = team_points + ?, animalkey = ?, animalkeycontrol = ? WHERE publickey = ?",
                    [selfPoints, teamPoints, player.publickey, player.publickey, player.publickey],
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
const EXECUTION_MINUTE = 0; // Минуты (от 0 до 59)

const BIK_AUTH = process.env.BIK_AUTH;
const KRISA_AUTH = process.env.KRISA_AUTH;
const DRAGON_AUTH = process.env.DRAGON_AUTH;

// Функция, которая будет выполняться в заданное время
const dailyFunction = async () => {
    console.log(`✅ Запуск ежедневного задания в ${EXECUTION_HOUR}:${EXECUTION_MINUTE} UTC`);

    // Здесь будет код выполнения задачи (добавим позже)
    



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
        setInterval(dailyFunction, 60 * 1000);
    }, timeUntilExecution);
};

// Запускаем задачу при старте сервера
scheduleDailyTask();
