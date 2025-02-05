import { NextApiRequest, NextApiResponse } from "next";
import * as order from "../../utils/orderService"; // Подключаем функции работы с БД

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {

        }



        if (req.method === "POST") {
            
        }



        if (req.method === "PUT") {

        }

        return res.status(405).json({ error: "Method Not Allowed" });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
