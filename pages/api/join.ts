import { NextApiRequest, NextApiResponse } from 'next';
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('game.db');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешён' });
  }

  try {
    const { publicKey, amount, transactionId, team } = req.body;

    // ✅ Проверяем входные данные
    if (!publicKey || !amount || !transactionId || team === undefined) {
      return res.status(400).json({ message: '❌ Недостаточно данных' });
    }
    if (typeof amount !== "number" || amount <= 0 || isNaN(amount)) {
      return res.status(400).json({ message: '❌ Некорректная сумма' });
    }
    if (team !== 1 && team !== 2) {
      return res.status(400).json({ message: '❌ Неверный идентификатор команды' });
    }

    console.log(`ℹ️ Добавляем игрока ${publicKey} в команду ${team} с вкладом ${amount} SOL`);

    // ✅ Используем `db.serialize()` для строгого выполнения по порядку
    db.serialize(async () => {
      try {
        // ✅ Добавляем пользователя в таблицу `users`
        await new Promise<void>((resolve, reject) => {
          db.run(
            `INSERT INTO users (publickey, input_sol, animalkey, team) VALUES (?, ?, ?, ?)`,
            [publicKey, amount, publicKey, team], // animalkey теперь null (если не передаётся)
            function (err) {
              if (err) {
                console.error("❌ Ошибка при добавлении пользователя:", err.message);
                reject(err);
              } else resolve();
            }
          );
        });

        console.log(`✅ Пользователь ${publicKey} успешно добавлен в users`);

        // ✅ Обновляем таблицу `teams`
        await new Promise<void>((resolve, reject) => {
          db.run(
            `UPDATE teams SET players = players + 1, bank = bank + ? WHERE id = ?`,
            [amount, team],
            function (err) {
              if (err) {
                console.error("❌ Ошибка при обновлении команды:", err.message);
                reject(err);
              } else resolve();
            }
          );
        });

        console.log(`✅ Команда ${team} успешно обновлена (банк +${amount} SOL, +1 игрок)`);

        res.status(200).json({ message: '✅ Пользователь успешно добавлен' });

      } catch (dbError) {
        console.error("❌ Ошибка в процессе транзакции БД:", dbError);
        res.status(500).json({ message: '❌ Ошибка в БД' });
      }
    });

  } catch (error) {
    console.error("❌ Ошибка в API /api/join:", error);
    res.status(500).json({ message: '❌ Ошибка сервера' });
  }
}
