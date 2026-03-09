FROM node:20-alpine

WORKDIR /app

# Копируем все файлы
COPY . .

# Устанавливаем порт
ENV PORT=3000
ENV NODE_ENV=production

# Открываем порт
EXPOSE 3000

# Запускаем сервер
CMD ["node", "server.js"]
