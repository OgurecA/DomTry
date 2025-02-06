const sqlite3 = require('sqlite3').verbose();

// Открываем (или создаем) базу данных
const db = new sqlite3.Database('nfts.db');

// Определяем список таблиц для создания
const tables = [
    `CREATE TABLE IF NOT EXISTS biks (
        publickey TEXT UNIQUE,
    );`,
    
    `CREATE TABLE IF NOT EXISTS rats (
        publickey TEXT UNIQUE,
    );`,

    `CREATE TABLE IF NOT EXISTS dragons (
        publickey TEXT UNIQUE,
    );`
];

// Функция для выполнения всех запросов
function migrate() {
    db.serialize(() => {
        tables.forEach(query => {
            db.run(query, err => {
                if (err) {
                    console.error("Ошибка при создании таблицы:", err.message);
                } else {
                    console.log("Таблица обновлена или уже существует.");
                }
            });
        });
    });

    db.close(() => console.log("Миграция завершена."));
}

// Запускаем миграцию
migrate();
