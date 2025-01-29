const db = require("./DataBase");

// Интерфейсы для структур данных
interface Order {
    id: number;
    sender?: string;
    receiver?: string;
    courier?: string;
    amount: number;
}



// Добавление нового заказа в `waitingOrders`
export function addWaitingOrderSender(sender: string, amount: number): number {
    const stmt = db.prepare("INSERT INTO waitingOrders (sender, amount) VALUES (?, ?)");
    const info = stmt.run(sender, amount);
    return info.lastInsertRowid as number;
}

export function addWaitingOrderReceiver(receiver: string, amount: number): number {
    const stmt = db.prepare("INSERT INTO waitingOrders (receiver, amount) VALUES (?, ?)");
    const info = stmt.run(receiver, amount);
    return info.lastInsertRowid as number;
}

// Перемещение заказа из `waitingOrders` в `activeOrders`
export function activateOrder(orderId: number, courier: string): void {
    const order = db.prepare("SELECT * FROM waitingOrders WHERE id = ?").get(orderId) as Order;
    if (!order) throw new Error("Order not found");

    if (!order.amount) {
        throw new Error("Order cannot be activated: amount is missing");
    }
    
    // Проверяем, что все поля (sender, receiver и courier) не NULL
    if (!order.sender || !order.receiver) {
        throw new Error("Order cannot be activated: sender or receiver is missing");
    }

    // Добавляем курьера
    order.courier = courier;

    const insertStmt = db.prepare("INSERT INTO activeOrders (id, sender, receiver, amount, courier) VALUES (?, ?, ?, ?, ?)");
    insertStmt.run(order.id, order.sender, order.receiver, order.amount, order.courier);

    db.prepare("DELETE FROM waitingOrders WHERE id = ?").run(orderId);
}


// Получить все ожидающие заказы
export function getWaitingOrders(): Order[] {
    return db.prepare("SELECT * FROM waitingOrders ORDER BY id ASC").all() as Order[];
}

export function getActiveOrders(): Order[] {
    return db.prepare("SELECT * FROM activeOrders ORDER BY id ASC").all() as Order[];
}

