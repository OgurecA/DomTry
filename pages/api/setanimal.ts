import { NextApiRequest, NextApiResponse } from "next";
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("game.db");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  try {
    const { publicKey, animalKey, animalUrl } = req.body;

    if (!publicKey || !animalKey || !animalUrl) {
      return res.status(400).json({ message: "Не переданы `publicKey`, `animalKey` или `animalUrl`" });
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

    // Обновляем `animalkey` и `animal_image`
    await new Promise<void>((resolve, reject) => {
      db.run(
        `UPDATE users SET animalkey = ?, animal_image = ? WHERE publickey = ?;`,
        [animalKey, animalUrl, publicKey],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    console.log(`✅ Обновлен animalKey: ${animalKey}, animal_image: ${animalUrl} для ${publicKey}`);
    res.status(200).json({ message: "animalKey и animal_image успешно обновлены" });

  } catch (error) {
    console.error("❌ Ошибка API setAnimal:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
