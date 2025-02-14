const sqlite3 = require('sqlite3').verbose();

// Открываем (или создаем) базу данных
const db = new sqlite3.Database('game.db');

// Определяем список таблиц для создания
const tables = [
    `CREATE TABLE IF NOT EXISTS users (
        publickey TEXT UNIQUE,
        animalkey TEXT,
        animal_image TEXT DEFAULT '/Avatar.png',
        personal_points INTEGER DEFAULT 0,
        team_points INTEGER DEFAULT 0,
        team INTEGER DEFAULT 0,
        input_sol REAL DEFAULT 0
    );`,
    
    `CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        bank INTEGER DEFAULT 0,
        players INTEGER DEFAULT 0,
        score INTEGER DEFAULT 0
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

        // Вставляем единственную строку с очками команд
        db.run(`
            INSERT INTO teams (name, bank, players, score) VALUES 
            ('Team A', 0, 0, 0),
            ('Team B', 0, 0, 0)
            ON CONFLICT(name) DO NOTHING
        `, err => {
            if (err) {
                console.error("Ошибка при вставке команд:", err.message);
            } else {
                console.log("Команды добавлены или уже существуют.");
            }
        
            // Закрываем БД только после выполнения всех операций
            db.close(() => console.log("Миграция завершена."));
        });        
    });
}


// Запускаем миграцию
migrate();
