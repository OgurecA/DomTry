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
      return res.status(400).json({ message: "Не передан `publicKey`" });
    }

    // Запрос к БД
    const row = await new Promise<{ publickey: string, animalkey: string | null, personal_points: number, team_points: number, input_sol: number } | null>(
      (resolve, reject) => {
        db.get(
          "SELECT publickey, animalkey, personal_points, team_points, input_sol FROM users WHERE publickey = ?",
          [publicKey],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      }
    );

    if (!row) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json({
      publicKey: row.publickey,
      animalKey: row.animalkey,
      personalPoints: row.personal_points,
      inputSol: row.input_sol,
    });

  } catch (error) {
    console.error("❌ Ошибка API getUser:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
