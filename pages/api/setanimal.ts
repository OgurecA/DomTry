import { NextApiRequest, NextApiResponse } from "next";
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("game.db");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  try {
    const { publicKey, animalKey } = req.body;

    if (!publicKey || !animalKey) {
      return res.status(400).json({ message: "Не переданы `publicKey` или `animalKey`" });
    }

    // Проверяем, существует ли пользователь
    const existingUser = await new Promise<{ publickey: string } | null>((resolve, reject) => {
      db.get("SELECT publickey FROM users WHERE publickey = ?", [publicKey], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Обновляем `animalkey`
    await new Promise<void>((resolve, reject) => {
      db.run(
        `UPDATE users SET animalkey = ? WHERE publickey = ?;`,
        [animalKey, publicKey],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    console.log(`✅ Обновлен animalKey: ${animalKey} для ${publicKey}`);
    res.status(200).json({ message: "animalKey успешно обновлён" });

  } catch (error) {
    console.error("❌ Ошибка API setAnimal:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
