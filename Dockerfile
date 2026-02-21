# Многоэтапная сборка для оптимизации размера образа

# Этап 1: Сборка приложения
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile && yarn cache clean

# Копируем исходный код
COPY . .

# Собираем приложение для production
RUN yarn build:ssr

# Генерируем sitemap
RUN yarn generate:sitemap

# Этап 2: Production образ
FROM node:18-alpine AS production

WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S angular -u 1001

# Копируем собранное приложение
COPY --from=builder --chown=angular:nodejs /app/dist ./dist
COPY --from=builder --chown=angular:nodejs /app/package.json /app/yarn.lock ./

# Устанавливаем только production зависимости
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Переключаемся на непривилегированного пользователя
USER angular

# Открываем порт
EXPOSE 4000

# Проверка здоровья контейнера
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Запускаем приложение
CMD ["node", "dist/stacionar-site/server/main.js"]
