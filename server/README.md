# AutoPremium Backend API

Backend для автосалона на Node.js с MongoDB и Express.js

## Установка и запуск

1. Установите зависимости:
```bash
cd server
npm install
```

2. Настройте переменные окружения в файле `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autosalon
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
NODE_ENV=development
```

3. Запустите MongoDB (убедитесь, что MongoDB установлен и запущен)

4. Заполните базу данных тестовыми данными:
```bash
npm run seed
```

5. Запустите сервер:
```bash
npm run dev
```

Сервер будет доступен по адресу: http://localhost:5000

## API Endpoints

### Автомобили (Cars)
- `GET /api/cars` - получить все автомобили (с фильтрами и пагинацией)
- `GET /api/cars/popular` - получить популярные автомобили
- `GET /api/cars/:id` - получить автомобиль по ID
- `GET /api/cars/:id/similar` - получить похожие автомобили
- `POST /api/cars` - создать новый автомобиль
- `PUT /api/cars/:id` - обновить автомобиль
- `DELETE /api/cars/:id` - удалить автомобиль

### Бренды (Brands)
- `GET /api/brands` - получить все бренды
- `GET /api/brands/:id` - получить бренд по ID
- `POST /api/brands` - создать новый бренд
- `PUT /api/brands/:id` - обновить бренд
- `DELETE /api/brands/:id` - удалить бренд

### Категории (Categories)
- `GET /api/categories` - получить все категории
- `GET /api/categories/:id` - получить категорию по ID
- `POST /api/categories` - создать новую категорию
- `PUT /api/categories/:id` - обновить категорию
- `DELETE /api/categories/:id` - удалить категорию

### Пользователи (Users)
- `GET /api/users` - получить всех пользователей
- `GET /api/users/:id` - получить пользователя по ID
- `POST /api/users` - создать нового пользователя
- `PUT /api/users/:id` - обновить пользователя
- `DELETE /api/users/:id` - удалить пользователя
- `POST /api/users/register` - регистрация
- `POST /api/users/login` - авторизация

### Заказы (Orders)
- `GET /api/orders` - получить все заказы
- `GET /api/orders/:id` - получить заказ по ID
- `POST /api/orders` - создать новый заказ
- `PUT /api/orders/:id` - обновить заказ
- `DELETE /api/orders/:id` - удалить заказ

### Услуги (Services)
- `GET /api/services` - получить все услуги
- `GET /api/services/:id` - получить услугу по ID
- `POST /api/services` - создать новую услугу
- `PUT /api/services/:id` - обновить услугу
- `DELETE /api/services/:id` - удалить услугу

### Записи (Appointments)
- `GET /api/appointments` - получить все записи
- `GET /api/appointments/:id` - получить запись по ID
- `POST /api/appointments` - создать новую запись
- `PUT /api/appointments/:id` - обновить запись
- `DELETE /api/appointments/:id` - удалить запись

### Отзывы (Reviews)
- `GET /api/reviews` - получить все отзывы
- `GET /api/reviews/:id` - получить отзыв по ID
- `POST /api/reviews` - создать новый отзыв
- `PUT /api/reviews/:id` - обновить отзыв
- `DELETE /api/reviews/:id` - удалить отзыв

### Новости (News)
- `GET /api/news` - получить все новости
- `GET /api/news/:id` - получить новость по ID или slug
- `POST /api/news` - создать новую новость
- `PUT /api/news/:id` - обновить новость
- `DELETE /api/news/:id` - удалить новость

### Обращения (Contacts)
- `GET /api/contacts` - получить все обращения
- `GET /api/contacts/:id` - получить обращение по ID
- `POST /api/contacts` - создать новое обращение
- `PUT /api/contacts/:id` - обновить обращение
- `DELETE /api/contacts/:id` - удалить обращение

## Структура проекта

```
server/
├── models/          # Модели MongoDB
├── controllers/     # Контроллеры
├── routes/          # Маршруты API
├── scripts/         # Скрипты (seed.js)
├── server.js        # Главный файл сервера
├── package.json     # Зависимости
└── .env            # Переменные окружения
```

## Модели данных

- **Car** - автомобили
- **Brand** - бренды автомобилей
- **Category** - категории автомобилей
- **User** - пользователи системы
- **Order** - заказы на покупку
- **Service** - услуги сервиса
- **Appointment** - записи на обслуживание
- **Review** - отзывы клиентов
- **News** - новости компании
- **Contact** - обращения клиентов

## Особенности

- MVC архитектура
- Валидация данных с помощью Mongoose
- Хеширование паролей с bcryptjs
- JWT аутентификация
- Пагинация и фильтрация
- Полнотекстовый поиск
- Защита от атак (helmet, rate limiting)
- CORS поддержка
- Подробные модели с связями
- Seed скрипт с реалистичными данными на русском языке