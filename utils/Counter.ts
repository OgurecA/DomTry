import sqlite3 from "sqlite3";

// Подключаем базу данных
const db = new sqlite3.Database("game.db");

// ⚡ Задаем время выполнения (в UTC)
const EXECUTION_HOUR = 10;  // Часы (от 0 до 23)
const EXECUTION_MINUTE = 14; // Минуты (от 0 до 59)

const BIK_AUTH = process.env.BIK_AUTH;
const KRISA_AUTH = process.env.KRISA_AUTH;
const DRAGON_AUTH = process.env.DRAGON_AUTH;

// Функция, которая будет выполняться в заданное время
const dailyFunction = () => {
    console.log(`✅ Запуск ежедневного задания в ${EXECUTION_HOUR}:${EXECUTION_MINUTE} UTC`);

    // Здесь будет код выполнения задачи (добавим позже)

    console.log("✅ Ежедневное задание завершено");
};

// Функция вычисляет, сколько миллисекунд осталось до заданного времени
const getMillisecondsUntilExecution = (): number => {
    const now = new Date();
    const nextExecution = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        EXECUTION_HOUR,
        EXECUTION_MINUTE,
        0,
        0
    ));

    // Если время уже прошло сегодня, берем следующее выполнение завтра
    if (now >= nextExecution) {
        nextExecution.setUTCDate(nextExecution.getUTCDate() + 1);
    }

    return nextExecution.getTime() - now.getTime();
};

// Запускаем таймер
const scheduleDailyTask = () => {
    const timeUntilExecution = getMillisecondsUntilExecution();

    console.log(`⏳ Следующее выполнение задачи через ${Math.round(timeUntilExecution / 1000 / 60)} минут`);

    // Устанавливаем setTimeout для первого запуска
    setTimeout(() => {
        dailyFunction();
        // После первого выполнения устанавливаем запуск раз в сутки (24 часа)
        setInterval(dailyFunction, 60 * 1000);
    }, timeUntilExecution);
};

// Запускаем задачу при старте сервера
scheduleDailyTask();
