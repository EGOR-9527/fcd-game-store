require("dotenv").config();

const express = require("express");
const sequelize = require("./db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./Router/index");
const ApiError = require("./exceptions/api-error");
const path = require('path'); // Импортируем модуль path из стандартной библиотеки

const app = express();
const PORT = process.env.PORT || 3000; // Определение порта


// Настройка CORS
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Обработчик несуществующих маршрутов
app.use((req, res, next) => {
  next(new ApiError(404, "Ресурс не найден"));
});

// Обработчик ошибок
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "Что-то пошло не так" });
});

// Запуск сервера
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Соединение с базой данных успешно установлено.");
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  } catch (e) {
    console.error("Ошибка подключения к базе данных: ", e);
  }
};

start();
