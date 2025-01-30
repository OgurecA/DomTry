const db = require("./DataBase");

// Интерфейсы для структур данных
interface Order {
    id: number;
    sender?: string;
    receiver?: string;
    courier?: string;
    amount: number;
    multisig_address_receiver?: string;
    multisig_address_courier?: string;
    serialized?: string;
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

export function acceptOrderAsReceiver(orderId: number, receiver: string): void {
    const order = db.prepare("SELECT * FROM waitingOrders WHERE id = ?").get(orderId) as Order;
    if (!order) throw new Error("Order not found");

    if (order.receiver) {
        throw new Error("Order already has a receiver");
    }

    const stmt = db.prepare("UPDATE waitingOrders SET receiver = ? WHERE id = ?");
    stmt.run(receiver, orderId);
}

export function acceptOrderAsSender(orderId: number, sender: string): void {
    const order = db.prepare("SELECT * FROM waitingOrders WHERE id = ?").get(orderId) as Order;
    if (!order) throw new Error("Order not found");

    if (order.sender) {
        throw new Error("Order already has a sender");
    }

    const stmt = db.prepare("UPDATE waitingOrders SET sender = ? WHERE id = ?");
    stmt.run(sender, orderId);
}

export function addMultisigAddressReceiver(orderId: number, multisigAddressReceiver: string): void {
    const order = db.prepare("SELECT * FROM activeOrders WHERE id = ?").get(orderId) as Order;
    if (!order) throw new Error("Order not found");

    if (order.multisig_address_receiver) {
        throw new Error("Order already has a multisig_address_receiver");
    }

    const stmt = db.prepare("UPDATE activeOrders SET multisig_address_receiver = ? WHERE id = ?");
    stmt.run(multisigAddressReceiver, orderId);
}

export function addMultisigAddressCourier(orderId: number, multisigAddressCourier: string): void {
    const order = db.prepare("SELECT * FROM activeOrders WHERE id = ?").get(orderId) as Order;
    if (!order) throw new Error("Order not found");

    if (order.multisig_address_courier) {
        throw new Error("Order already has a multisig_address_courier");
    }

    const stmt = db.prepare("UPDATE activeOrders SET multisig_address_courier = ? WHERE id = ?");
    stmt.run(multisigAddressCourier, orderId);
}

export function addSerialized(orderId: number, serialized: string): void {
    const order = db.prepare("SELECT * FROM activeOrders WHERE id = ?").get(orderId) as Order;
    if (!order) throw new Error("Order not found");

    if (order.serialized) {
        throw new Error("Order already has a serialized");
    }

    const stmt = db.prepare("UPDATE activeOrders SET serialized = ? WHERE id = ?");
    stmt.run(serialized, orderId);
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

    const insertStmt = db.prepare("INSERT INTO activeOrders (id, sender, receiver, courier, amount) VALUES (?, ?, ?, ?, ?)");
    insertStmt.run(order.id, order.sender, order.receiver, order.courier, order.amount);

    db.prepare("DELETE FROM waitingOrders WHERE id = ?").run(orderId);
}


// Получить все ожидающие заказы
export function getWaitingOrders(): Order[] {
    return db.prepare("SELECT * FROM waitingOrders ORDER BY id ASC").all() as Order[];
}

export function getActiveOrders(): Order[] {
    return db.prepare("SELECT * FROM activeOrders ORDER BY id ASC").all() as Order[];
}

