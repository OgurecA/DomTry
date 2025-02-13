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

    const row = await new Promise<{ publicKey: string } | null>((resolve, reject) => {
      db.get("SELECT publickey FROM users WHERE publickey = ?", [publicKey], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.status(200).json({ exists: !!row });
  } catch (error) {
    console.error("❌ Ошибка API checkUser:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
