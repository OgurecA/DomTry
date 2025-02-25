import { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("game.db");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  try {
    // 1️⃣ Находим лучшего игрока из команды 1
    const bestPlayerTeam1 = await new Promise<string | null>((resolve, reject) => {
      db.get(
        "SELECT publickey FROM users WHERE team = 1 ORDER BY personal_points DESC LIMIT 1",
        (err, row: { publickey: string } | null) => {
          if (err) reject(err);
          else resolve(row ? row.publickey : null);
        }
      );
    });

    // 2️⃣ Находим лучшего игрока из команды 2
    const bestPlayerTeam2 = await new Promise<string | null>((resolve, reject) => {
      db.get(
        "SELECT publickey FROM users WHERE team = 2 ORDER BY personal_points DESC LIMIT 1",
        (err, row: { publickey: string } | null) => {
          if (err) reject(err);
          else resolve(row ? row.publickey : null);
        }
      );
    });

    // 3️⃣ Отправляем данные клиенту
    res.status(200).json({
      bestPlayerTeam1,
      bestPlayerTeam2,
    });

  } catch (error) {
    console.error("❌ Ошибка API bestPlayers:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
