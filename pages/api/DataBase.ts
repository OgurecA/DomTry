import Database from "better-sqlite3";

// Подключаемся к БД (если файла `orders.db` нет, он создастся автоматически)
const db = new Database("orders.db");

// Создаём таблицы, если они ещё не существуют
db.exec(`
    CREATE TABLE IF NOT EXISTS waitingOrders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT DEFAULT NULL,
        receiver TEXT DEFAULT NULL,
        courier TEXT DEFAULT NULL,
        amount INTEGER NOT NULL,
    );

    CREATE TABLE IF NOT EXISTS activeOrders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT DEFAULT NULL,
        receiver TEXT DEFAULT NULL,
        courier TEXT DEFAULT NULL,
        amount INTEGER NOT NULL,
        courier TEXT NOT NULL,
    );
`);

console.log("База данных и таблицы инициализированы.");

export default db;
