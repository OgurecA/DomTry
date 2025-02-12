const sqlite3 = require('sqlite3').verbose();

// Открываем (или создаем) базу данных
const db = new sqlite3.Database('game.db');

// Определяем список таблиц для создания
const tables = [
    `CREATE TABLE IF NOT EXISTS users (
        publickey TEXT UNIQUE,
        animalkey TEXT,
        personal_points INTEGER DEFAULT 0,
        team INTEGER DEFAULT 0,
        input_sol REAL DEFAULT 0
    );`,
    
    `CREATE TABLE IF NOT EXISTS teams (
        team_a INTEGER DEFAULT 0,
        team_b INTEGER DEFAULT 0
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
