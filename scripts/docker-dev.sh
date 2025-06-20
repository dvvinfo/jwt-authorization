#!/bin/bash

echo "🚀 Запуск JWT Authorization App в режиме разработки..."

# Останавливаем существующие контейнеры
docker-compose down

# Собираем и запускаем контейнеры
docker-compose up --build -d

echo "✅ Приложение запущено!"
echo "📱 Фронтенд: http://localhost:3001"
echo "🔧 Бэкенд: http://localhost:3000"
echo "📚 Swagger: http://localhost:3000/api/docs"
echo "🗄️  База данных: localhost:5432"

# Показываем логи
docker-compose logs -f 