# Этап сборки
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап продакшена
FROM node:18-alpine AS runner

# Устанавливаем рабочую директорию
WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production && npm cache clean --force

# Копируем собранное приложение из этапа сборки
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output

# Переключаемся на пользователя nuxtjs
USER nuxtjs

# Открываем порт
EXPOSE 3001

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3001

# Запускаем приложение
CMD ["node", ".output/server/index.mjs"] 