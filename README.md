# JWT Authorization Project

Полнофункциональное приложение с JWT авторизацией, построенное на NestJS (бэкенд) и Nuxt 3 (фронтенд).

## 🚀 Возможности

### Бэкенд (NestJS)
- **JWT авторизация** с токенами
- **Ролевая система** (ADMIN, MODERATOR, USER)
- **CRUD операции** для постов
- **Управление пользователями** (бан, назначение ролей)
- **Загрузка файлов** (изображения для постов)
- **Swagger документация** API
- **Валидация данных** с class-validator
- **TypeORM** для работы с базой данных

### Фронтенд (Nuxt 3)
- **Современный UI** с Tailwind CSS
- **Авторизация и регистрация**
- **Управление постами** (создание, редактирование, удаление)
- **Админ панель** для управления пользователями и ролями
- **Адаптивный дизайн**
- **TypeScript** поддержка
- **Pinia** для управления состоянием

## 📋 Требования

- Node.js 18+
- Docker и Docker Compose
- PostgreSQL (через Docker)

## 🛠 Установка и запуск

### Вариант 1: Docker (Рекомендуется)

#### Быстрый запуск в режиме разработки:
```bash
# Клонирование репозитория
git clone <repository-url>
cd JWT-authorization

# Запуск через Docker
chmod +x scripts/docker-dev.sh
./scripts/docker-dev.sh
```

#### Запуск в продакшене:
```bash
# Создайте .env файл с переменными окружения
cp .env.example .env
# Отредактируйте .env файл

# Запуск в продакшене
chmod +x scripts/docker-prod.sh
./scripts/docker-prod.sh
```

#### Ручной запуск через Docker Compose:

**Разработка:**
```bash
docker-compose up --build -d
```

**Продакшен:**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Вариант 2: Локальная разработка

#### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd JWT-authorization
```

#### 2. Запуск бэкенда

```bash
cd backend

# Установка зависимостей
npm install

# Запуск через Docker Compose (рекомендуется)
docker-compose up -d

# Или локально (требует установленный PostgreSQL)
npm run start:dev
```

Бэкенд будет доступен по адресу: `http://localhost:3000`
Swagger документация: `http://localhost:3000/api/docs`

#### 3. Запуск фронтенда

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

Фронтенд будет доступен по адресу: `http://localhost:3001`

## 🔧 Конфигурация

### Переменные окружения (бэкенд)

Создайте файл `.env` в папке `backend`:

```env
# База данных
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=jwt_auth

# JWT
JWT_ACCESS_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Порт
PORT=3000
```

### Переменные окружения (фронтенд)

Создайте файл `.env` в папке `frontend`:

```env
# API URL
NUXT_PUBLIC_API_BASE=http://localhost:3000/api
```

### Переменные окружения (продакшен)

Создайте файл `.env` в корне проекта:

```env
# База данных
DB_PASSWORD=your_secure_password

# JWT
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_here
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_here
```

## 🐳 Docker контейнеры

### Структура Docker файлов:

```
JWT-authorization/
├── docker-compose.yml              # Разработка
├── docker-compose.prod.yml         # Продакшен
├── backend/
│   ├── Dockerfile                  # Продакшен
│   └── Dockerfile.dev              # Разработка
├── frontend/
│   ├── Dockerfile                  # Продакшен
│   ├── Dockerfile.dev              # Разработка
│   └── docker-compose.yml          # Локальный фронтенд
└── scripts/
    ├── docker-dev.sh               # Скрипт запуска разработки
    └── docker-prod.sh              # Скрипт запуска продакшена
```

### Команды Docker:

```bash
# Разработка
docker-compose up --build -d
docker-compose logs -f
docker-compose down

# Продакшен
docker-compose -f docker-compose.prod.yml up --build -d
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml down

# Отдельные сервисы
docker-compose up postgres -d
docker-compose up backend -d
docker-compose up frontend -d
```

## 📚 API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/registration` - Регистрация

### Пользователи (требует роль ADMIN)
- `GET /api/users` - Получить всех пользователей
- `GET /api/users/:id` - Получить пользователя по ID
- `POST /api/users/role` - Назначить роль пользователю
- `POST /api/users/ban` - Забанить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

### Роли (требует роль ADMIN)
- `GET /api/roles` - Получить все роли
- `GET /api/roles/:value` - Получить роль по значению
- `POST /api/roles` - Создать новую роль

### Посты
- `GET /api/posts` - Получить все посты
- `GET /api/posts/:id` - Получить пост по ID
- `POST /api/posts` - Создать пост (требует авторизацию)
- `PATCH /api/posts/:id` - Обновить пост (требует авторизацию)
- `DELETE /api/posts/:id` - Удалить пост (требует авторизацию)

## 👥 Роли пользователей

### USER
- Просмотр постов
- Создание своих постов
- Редактирование своих постов
- Удаление своих постов

### MODERATOR
- Все возможности USER
- Модерация постов других пользователей

### ADMIN
- Все возможности MODERATOR
- Управление пользователями
- Управление ролями
- Доступ к админ панели

## 🎨 Структура проекта

```
JWT-authorization/
├── backend/                 # NestJS бэкенд
│   ├── src/
│   │   ├── auth/           # Модуль аутентификации
│   │   ├── users/          # Модуль пользователей
│   │   ├── posts/          # Модуль постов
│   │   ├── roles/          # Модуль ролей
│   │   └── files/          # Модуль файлов
│   ├── docker-compose.yml  # Docker конфигурация
│   └── package.json
├── frontend/               # Nuxt 3 фронтенд
│   ├── components/         # Vue компоненты
│   ├── pages/             # Страницы приложения
│   ├── stores/            # Pinia stores
│   ├── composables/       # Composables
│   ├── types/             # TypeScript типы
│   └── package.json
├── scripts/               # Скрипты запуска
├── docker-compose.yml     # Общий Docker Compose
└── README.md
```

## 🔐 Безопасность

- JWT токены с временем жизни
- Хеширование паролей (bcrypt)
- Валидация входных данных
- Ролевая система доступа
- CORS настройки
- Защита от SQL инъекций

## 🧪 Тестирование

### Бэкенд
```bash
cd backend
npm run test          # Unit тесты
npm run test:e2e      # E2E тесты
npm run test:cov      # Покрытие кода тестами
```

### Фронтенд
```bash
cd frontend
npm run test          # Unit тесты
npm run test:e2e      # E2E тесты
```

## 📦 Сборка для продакшена

### Бэкенд
```bash
cd backend
npm run build
npm run start:prod
```

### Фронтенд
```bash
cd frontend
npm run build
npm run preview
```

## 🐳 Docker

### Запуск всего проекта через Docker
```bash
# Разработка
docker-compose up --build -d

# Продакшен
docker-compose -f docker-compose.prod.yml up --build -d
```

### Отдельные сервисы
```bash
# Только база данных
docker-compose up postgres -d

# Только бэкенд
docker-compose up backend -d

# Только фронтенд
docker-compose up frontend -d
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для получения дополнительной информации.

## 🆘 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте [Issues](https://github.com/your-repo/issues)
2. Создайте новое Issue с подробным описанием проблемы
3. Убедитесь, что вы используете последнюю версию проекта

## 🔄 Обновления

Для обновления проекта:

```bash
# Обновление бэкенда
cd backend
git pull origin main
npm install
npm run build

# Обновление фронтенда
cd frontend
git pull origin main
npm install
npm run build
``` 