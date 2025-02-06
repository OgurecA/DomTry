const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('nfts.db'); // Подключаем базу

app.use(cors()); // Разрешаем запросы с другого устройства
app.use(express.json()); // Позволяем обрабатывать JSON

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
app.post('/addPublicKey', (req, res) => {
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
