import { NextApiRequest, NextApiResponse } from "next";
import * as order from "../../utils/orderService"; // Подключаем функции работы с БД

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            // Получаем заказы (ожидающие или активные)
            const { status } = req.query;
            if (status === "waiting") {
                return res.status(200).json(order.getWaitingOrders());
            }
            if (status === "active") {
                return res.status(200).json(order.getActiveOrders());
            }
            return res.status(400).json({ error: "Invalid status parameter" });
        }



        if (req.method === "POST") {
            // Добавляем заказ (отправитель или получатель)
            const { sender, receiver, amount } = req.body;

            if (sender) {
                const id = order.addWaitingOrderSender(sender, amount);
                return res.status(201).json({ id });
            }

            if (receiver) {
                const id = order.addWaitingOrderReceiver(receiver, amount);
                return res.status(201).json({ id });
            }

            return res.status(400).json({ error: "Sender or Receiver required" });
        }



        if (req.method === "PUT") {
            // Активируем заказ (назначаем курьера)
            const { orderId, role, user } = req.body;
                if (!orderId || !role || !user) {
                res.status(400).json({ error: "Missing orderId, role, or user" });
                return;
            }

            try {

                if (role === "receiver") {
                    order.acceptOrderAsReceiver(orderId, user);
                } else if (role === "sender") {
                    order.acceptOrderAsSender(orderId, user);
                } else if (role === "courier"){
                    order.activateOrder(orderId, user);
                } else if (role === "multisigAddressReceiver"){
                    order.addMultisigAddressReceiver(orderId, user);
                } else if (role === "multisigAddressCourier"){
                    order.addMultisigAddressCourier(orderId, user);
                } else if (role === "serialized"){
                    order.addSerialized(orderId, user);
                }

                return res.status(200).json({ message: "Order activated" });

            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }

        return res.status(405).json({ error: "Method Not Allowed" });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
