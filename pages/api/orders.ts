import { NextApiRequest, NextApiResponse } from "next";
import { addWaitingOrderSender, getWaitingOrders } from "../../utils/orderService";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const orders = getWaitingOrders();
            res.json(orders);
        } else if (req.method === "POST") {
            const { sender, amount } = req.body;
            if (!sender || !amount) {
                return res.status(400).json({ error: "Missing sender or amount" });
            }
            const id = addWaitingOrderSender(sender, amount);
            res.json({ id });
        } else {
            res.status(405).json({ error: "Method Not Allowed" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
