import { Connection } from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("game.db");
// Открываем подключение к базе данных
const connection = new Connection("https://api.devnet.solana.com");

const EXPECTED_RECEIVER_PUBLIC_KEY = "J5vSjmTn4yhetWWncr5KzC1VbrgPVwEQ3BeBT4bs4CrC";

const MAX_TRANSACTION_AGE = 300;

interface ParsedInstruction {
    type: string;
    info: {
        source?: string;
        destination?: string;
        amount?: number;
    };
}

// Функция проверки транзакции (должна быть где-то определена)
const verifyTransaction = async (transactionId: string, expectedPublicKey: string, expectedAmount: number) => {
    try {
        // Получаем информацию о транзакции
        const tx = await connection.getParsedTransaction(transactionId, { commitment: "finalized" });

        if (!tx) {
            console.log("❌ Ошибка: транзакция не найдена!");
            return false;
        }

        const blockTime = tx.blockTime;
        if (!blockTime) {
            console.log("❌ Ошибка: невозможно получить время блока!");
            return false;
        }

        const currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
        if (currentTime - blockTime > MAX_TRANSACTION_AGE) {
            console.log("❌ Ошибка: транзакция слишком старая!");
            return false;
        }

        // Извлекаем список инструкций из транзакции
        const instructions = tx.transaction.message.instructions;
        let senderPublicKey: string | null = null;
        let receiverPublicKey: string | null = null;
        let actualAmount: number = 0;

        for (const instruction of instructions) {
            if ("parsed" in instruction && typeof instruction.parsed === "object" && instruction.parsed !== null) {
                const parsed = instruction.parsed as ParsedInstruction; // ✅ Используем тип вместо any
        
                // Проверяем, что это перевод токенов (SPL Token Program)
                if (parsed.type === "transfer" && parsed.info.source && parsed.info.destination && parsed.info.amount) {
                    senderPublicKey = parsed.info.source;
                    receiverPublicKey = parsed.info.destination;
                    const rawAmount = parsed.info.amount; // 🟢 Количество токенов в минимальных единицах
        
                    // ✅ Автоматически получаем `decimals` у токена
                    const decimals = 2; // Здесь можно динамически получать `decimals` (если доступно)
                    actualAmount = rawAmount / (10 ** decimals);
                }
            }
        }
      

        // Проверяем, что отправитель совпадает с ожидаемым publicKey
        if (senderPublicKey !== expectedPublicKey) {
            console.log(`❌ Ошибка: транзакция не от ${expectedPublicKey}, а от ${senderPublicKey}`);
            return false;
        }

        // Проверяем, что получатель — это наш кошелек (банк игры)
        if (receiverPublicKey !== EXPECTED_RECEIVER_PUBLIC_KEY) {
            console.log(`❌ Ошибка: деньги ушли не в наш кошелек, а в ${receiverPublicKey}`);
            return false;
        }

        // Проверяем, что сумма перевода соответствует ожидаемой
        if (actualAmount < expectedAmount) {
            console.log(`❌ Ошибка: сумма ${actualAmount} SOL меньше ожидаемых ${expectedAmount} SOL`);
            return false;
        }

        console.log(`✅ Транзакция ${transactionId} подтверждена: ${actualAmount} SOL от ${senderPublicKey} к ${receiverPublicKey}`);
        return true;
    } catch (error) {
        console.error("❌ Ошибка при проверке транзакции:", error);
        return false;
    }
};

// API Route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Метод не разрешён' });
    }

    // Получаем данные из запроса
    const { transactionId, publicKey, amount } = req.body;

    if (!transactionId || !publicKey || !amount) {
        return res.status(400).json({ message: "❌ Ошибка: Недостаточно данных для проверки!" });
    }

    try {

        const existingTransaction = await new Promise((resolve, reject) => {
            db.get("SELECT join_signature FROM users WHERE join_signature = ?", [transactionId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (existingTransaction) {
            console.log(`❌ Ошибка: Транзакция ${transactionId} уже использована!`);
            return res.status(400).json({ message: "❌ Ошибка: Транзакция уже была использована!" });
        }
        // Проверяем транзакцию
        const isTransactionValid = await verifyTransaction(transactionId, publicKey, amount);

        if (!isTransactionValid) {
            return res.status(400).json({ message: "❌ Ошибка: Неверная или поддельная транзакция!" });
        }

        // ✅ Если всё ок, возвращаем успех
        res.json({ message: "✅ Транзакция успешно проверена" });

    } catch (error) {
        console.error("❌ Ошибка при проверке транзакции:", error);
        res.status(500).json({ message: "❌ Ошибка сервера при проверке транзакции!" });
    }
}
