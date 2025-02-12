import { NextApiRequest, NextApiResponse } from 'next';
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('game.db');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешён' });
  }

  try {
    const { publicKey, amount, transactionId } = req.body;

    if (!publicKey || !amount || !transactionId) {
      return res.status(400).json({ message: 'Недостаточно данных' });
    }

    // Добавляем пользователя в таблицу `users`
    await new Promise<void>((resolve, reject) => {
      db.run(
        `INSERT INTO users (publickey, input_sol) VALUES (?, ?) 
         ON CONFLICT(publickey) DO UPDATE SET input_sol = input_sol + ?;`,
        [publicKey, amount, amount],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.status(200).json({ message: 'Пользователь успешно добавлен' });

  } catch (error) {
    console.error("❌ Ошибка в API /api/join:", error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}
