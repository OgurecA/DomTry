import { NextApiRequest, NextApiResponse } from "next";
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("game.db");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  try {
    const { publicKey } = req.body;
    if (!publicKey) {
      return res.status(400).json({ message: "Не передан publicKey" });
    }

    // Запрос к БД
    const row = await new Promise<{ animalkey: string | null } | null>((resolve, reject) => {
      db.get("SELECT animalkey FROM users WHERE publickey = ?", [publicKey], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json({ animalKey: row.animalkey });
  } catch (error) {
    console.error("❌ Ошибка API getAnimal:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
