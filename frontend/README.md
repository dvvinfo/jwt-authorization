# JWT Authorization Frontend

Фронтенд приложение для JWT авторизации, построенное на Nuxt 3 с собственными UI компонентами на Tailwind CSS.

## Особенности

- 🔐 JWT аутентификация и авторизация
- 👥 Управление пользователями и ролями
- 📝 Система постов с CRUD операциями
- 🎨 Современный UI с Tailwind CSS
- 📱 Адаптивный дизайн
- 🔒 Защищенные маршруты
- ✅ Валидация форм с Zod

## Технологии

- **Nuxt 3** - Vue.js фреймворк
- **Tailwind CSS** - CSS фреймворк
- **Pinia** - Управление состоянием
- **Zod** - Валидация схем
- **Vue Router** - Маршрутизация

## Компоненты UI

Приложение использует собственные компоненты UI, построенные на Tailwind CSS:

### BaseButton
Универсальная кнопка с различными вариантами стилей.

```vue
<BaseButton
  variant="primary"
  size="md"
  icon="plus"
  :loading="loading"
  @click="handleClick"
>
  Текст кнопки
</BaseButton>
```

**Пропсы:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: строка с названием иконки
- `loading`: boolean
- `disabled`: boolean
- `block`: boolean
- `type`: 'button' | 'submit' | 'reset'

### BaseInput
Поле ввода с поддержкой валидации.

```vue
<BaseInput
  v-model="value"
  label="Email"
  type="email"
  placeholder="Введите email"
  :error="errors.email"
  required
/>
```

**Пропсы:**
- `modelValue`: string
- `label`: string
- `type`: string
- `placeholder`: string
- `error`: string
- `hint`: string
- `required`: boolean
- `disabled`: boolean

### BaseTextarea
Многострочное поле ввода.

```vue
<BaseTextarea
  v-model="content"
  label="Содержание"
  :rows="5"
  :error="errors.content"
/>
```

### BaseCard
Карточка с заголовком и футером.

```vue
<BaseCard variant="elevated">
  <template #header>
    <h3>Заголовок карточки</h3>
  </template>
  
  Содержимое карточки
  
  <template #footer>
    <BaseButton>Действие</BaseButton>
  </template>
</BaseCard>
```

### BaseAlert
Уведомления с различными типами.

```vue
<BaseAlert
  variant="success"
  dismissible
  @dismiss="handleDismiss"
>
  Успешное выполнение операции
</BaseAlert>
```

**Пропсы:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `dismissible`: boolean
- `icon`: boolean

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` в корне проекта:
```env
API_BASE_URL=http://localhost:3000
```

3. Запустите сервер разработки:
```bash
npm run dev
```

4. Откройте [http://localhost:3000](http://localhost:3000)

## Структура проекта

```
frontend/
├── components/
│   └── UI/                 # Собственные UI компоненты
│       ├── BaseButton.vue
│       ├── BaseInput.vue
│       ├── BaseTextarea.vue
│       ├── BaseCard.vue
│       └── BaseAlert.vue
├── pages/                  # Страницы приложения
│   ├── index.vue          # Главная страница
│   ├── login.vue          # Страница входа
│   ├── register.vue       # Страница регистрации
│   ├── posts/             # Страницы постов
│   └── admin/             # Админ панель
├── stores/                # Pinia stores
│   ├── auth.ts           # Store аутентификации
│   └── posts.ts          # Store постов
├── middleware/            # Middleware для защиты маршрутов
├── layouts/              # Макеты страниц
└── assets/               # Статические ресурсы
```

## Функциональность

### Аутентификация
- Регистрация новых пользователей
- Вход в систему с JWT токенами
- Автоматическое обновление токенов
- Защищенные маршруты

### Управление постами
- Создание, редактирование, удаление постов
- Просмотр списка постов
- Загрузка изображений по URL
- Права доступа (автор или админ)

### Админ панель
- Управление пользователями
- Управление ролями
- Блокировка/разблокировка пользователей
- Назначение ролей

## API интеграция

Приложение интегрируется с NestJS backend API:

- **Аутентификация**: `/auth/login`, `/auth/registration`
- **Пользователи**: `/users/*`
- **Посты**: `/posts/*`
- **Роли**: `/roles/*`

Все запросы включают JWT токен в заголовке Authorization.

## Разработка

### Добавление новых компонентов

1. Создайте файл в `components/UI/`
2. Используйте Tailwind CSS для стилизации
3. Добавьте TypeScript интерфейсы для пропсов
4. Экспортируйте компонент

### Добавление новых страниц

1. Создайте файл в `pages/`
2. Используйте layout по умолчанию или создайте новый
3. Добавьте middleware для защиты если необходимо

### Добавление новых stores

1. Создайте файл в `stores/`
2. Используйте Composition API с Pinia
3. Добавьте типы для данных

## Лицензия

MIT
