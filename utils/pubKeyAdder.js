const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const db = new sqlite3.Database('nfts.db'); // Подключаем базу

app.use(cors()); // Разрешаем запросы с другого устройства
app.use(express.json()); // Позволяем обрабатывать JSON

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("❌ Ошибка: API_KEY не задан в .env!");
    process.exit(1);
}

function checkApiKey(req, res, next) {
    const clientKey = req.headers["x-api-key"];
    if (clientKey !== API_KEY) {
        return res.status(403).json({ error: "🚫 Доступ запрещен (неверный API-ключ)" });
    }
    next();
}

// Функция для добавления ключа в нужную таблицу
function addPublicKey(table, publicKey, res) {
    const query = `INSERT INTO ${table} (publickey) VALUES (?)`;
    db.run(query, [publicKey], function (err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ error: "Этот publicKey уже существует в таблице" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, table, publicKey });
    });
}

// Маршрут для добавления ключа
app.post('/addPublicKey', checkApiKey, (req, res) => {
    const { table, publicKey } = req.body;

    if (!table || !publicKey) {
        return res.status(400).json({ error: "Необходимо указать 'table' и 'publicKey'" });
    }

    if (!["biks", "rats", "dragons"].includes(table)) {
        return res.status(400).json({ error: "Неверное имя таблицы" });
    }
    addPublicKey(table, publicKey, res);
});

// Запускаем сервер
const PORT = 3400;
app.listen(PORT, () => console.log(`✅ API запущено на порту ${PORT}`));
