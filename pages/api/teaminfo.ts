import { NextApiRequest, NextApiResponse } from "next";
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("game.db");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  try {
    // Запрос к БД для получения всех команд
    const rows = await new Promise<{
      id: number;
      name: string;
      bank: number;
      players: number;
      score: number;
    }[]>((resolve, reject) => {
      db.all(
        "SELECT id, name, bank, players, score FROM teams",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Команды не найдены" });
    }

    res.status(200).json({ teams: rows });

  } catch (error) {
    console.error("❌ Ошибка API getTeams:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
