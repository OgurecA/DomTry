import { NextApiRequest, NextApiResponse } from "next";
import {
    addWaitingOrderSender,
    addWaitingOrderReceiver,
    activateOrder,
    getWaitingOrders,
    getActiveOrders
} from "../../utils/orderService"; // Подключаем функции работы с БД

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            // Получаем заказы (ожидающие или активные)
            const { status } = req.query;
            if (status === "waiting") {
                return res.status(200).json(getWaitingOrders());
            }
            if (status === "active") {
                return res.status(200).json(getActiveOrders());
            }
            return res.status(400).json({ error: "Invalid status parameter" });
        }

        if (req.method === "POST") {
            // Добавляем заказ (отправитель или получатель)
            const { sender, receiver, amount } = req.body;

            if (sender) {
                const id = addWaitingOrderSender(sender, amount);
                return res.status(201).json({ id });
            }

            if (receiver) {
                const id = addWaitingOrderReceiver(receiver, amount);
                return res.status(201).json({ id });
            }

            return res.status(400).json({ error: "Sender or Receiver required" });
        }

        if (req.method === "PUT") {
            // Активируем заказ (назначаем курьера)
            const { orderId, courier } = req.body;
            if (!orderId || !courier) {
                return res.status(400).json({ error: "Order ID and Courier required" });
            }
            activateOrder(orderId, courier);
            return res.status(200).json({ message: "Order activated" });
        }

        return res.status(405).json({ error: "Method Not Allowed" });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
