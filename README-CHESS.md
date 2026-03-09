# ♔ Chess Master - Онлайн Шахматы

Полнофункциональное веб-приложение шахмат с возможностью игры против ИИ, локального мультиплеера и онлайн-игры через интернет.

## 🎮 Возможности

### Режимы игры
- **Против ИИ** - три уровня сложности (лёгкий, средний, сложный)
- **Локальный мультиплеер** - два игрока на одном устройстве
- **Онлайн мультиплеер** - игра с другом через интернет

### Функционал
- ✅ Полная валидация всех правил шахмат
- ✅ Рокировка (короткая и длинная)
- ✅ Взятие на проходе (en passant)
- ✅ Превращение пешки
- ✅ Шах, мат, пат
- ✅ Ничья (правило 50 ходов)
- ✅ Таймер для каждого игрока
- ✅ История ходов в алгебраической нотации
- ✅ Подсветка возможных ходов
- ✅ Адаптивный дизайн (мобильные устройства)

## 🚀 Деплой на выделенный сервер

### Требования
- Ubuntu 20.04/22.04 или аналогичный Linux
- Node.js 18+ и npm/bun
- 1GB RAM минимум (2GB рекомендуется)
- Открытые порты 3000 (фронтенд) и 3003 (WebSocket)

### Шаг 1: Подготовка сервера

```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Или установите Bun
curl -fsSL https://bun.sh/install | bash

# Установите PM2 для управления процессами
sudo npm install -g pm2
```

### Шаг 2: Загрузка проекта

```bash
# Клонируйте или загрузите проект на сервер
git clone <ваш-репозиторий> /var/www/chess
cd /var/www/chess

# Установите зависимости
bun install
# или
npm install
```

### Шаг 3: Настройка переменных окружения

```bash
# Создайте файл .env
cat > .env << EOF
NODE_ENV=production
PORT=3000
EOF
```

### Шаг 4: Сборка и запуск

```bash
# Сборка проекта
bun run build
# или
npm run build

# Запуск через PM2
pm2 start npm --name "chess-web" -- start
pm2 start npm --name "chess-socket" -- run socket-server

# Сохранение конфигурации PM2
pm2 save
pm2 startup
```

### Шаг 5: Настройка Nginx (рекомендуется)

```bash
# Установите Nginx
sudo apt install -y nginx

# Создайте конфигурацию
sudo cat > /etc/nginx/sites-available/chess << 'EOF'
server {
    listen 80;
    server_name ваш-домен.com;  # Или IP-адрес

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Активируйте сайт
sudo ln -s /etc/nginx/sites-available/chess /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Шаг 6: SSL сертификат (опционально)

```bash
# Установите Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получите SSL сертификат
sudo certbot --nginx -d ваш-домен.com
```

## 🎯 Как играть онлайн

1. **Создание комнаты:**
   - Выберите "Online" режим
   - Введите ваше имя
   - Выберите контроль времени
   - Нажмите "Create Room"
   - Отправьте код комнаты другу

2. **Присоединение к комнате:**
   - Выберите "Online" режим
   - Введите ваше имя
   - Нажмите "Join Room"
   - Введите код комнаты (например: ABC123)
   - Нажмите "Join"

## 🔧 Разработка

```bash
# Установка зависимостей
bun install

# Запуск в режиме разработки
bun run dev

# Проверка кода
bun run lint

# Сборка
bun run build
```

## 📁 Структура проекта

```
src/
├── app/
│   ├── page.tsx          # Главная страница
│   ├── layout.tsx        # Layout
│   ├── globals.css       # Глобальные стили
│   └── api/
│       └── ai-move/      # API для ИИ ходов
├── components/
│   ├── ChessBoard.tsx    # Шахматная доска
│   ├── ChessPiece.tsx    # Фигуры (SVG)
│   ├── GameModeSelect.tsx # Выбор режима
│   ├── GameTimer.tsx     # Таймер
│   └── ui/               # UI компоненты (shadcn)
├── lib/
│   ├── chess/
│   │   ├── engine.ts     # Шахматная логика
│   │   └── types.ts      # Типы
│   └── socket/
│       ├── client.ts     # WebSocket клиент
│       └── server.ts     # WebSocket сервер
└── hooks/
    └── useChessGame.ts   # Хук для игры
```

## 🛠 Технологии

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI:** shadcn/ui, Lucide Icons
- **WebSocket:** Socket.io
- **AI:** z-ai-web-dev-sdk (LLM) + Minimax с альфа-бета отсечением

## 📝 Лицензия

MIT

---

Создано с ❤️ для любителей шахмат
