# Docker деплой с использованием volumes

Этот подход позволяет собирать приложение локально и монтировать готовую сборку в Docker контейнер через volumes. Это значительно ускоряет процесс деплоя и позволяет переиспользовать локальную сборку.

## Преимущества подхода с volumes

✅ **Быстрый деплой** - не нужно пересобирать внутри контейнера  
✅ **Меньше размер образа** - только runtime зависимости  
✅ **Переиспользование сборки** - одну сборку можно использовать в разных окружениях  
✅ **Быстрая отладка** - можно быстро заменить файлы без пересборки образа  
✅ **Экономия ресурсов** - сборка происходит на более мощной локальной машине  

## Структура файлов

```
├── docker-compose.yml          # Основная конфигурация с volumes
├── Dockerfile.production       # Легковесный Dockerfile для production
├── deploy-with-volumes.sh      # Автоматизированный скрипт деплоя
└── dist/                       # Локально собранное приложение (монтируется)
```

## Быстрый старт

### 1. Автоматический деплой (рекомендуется)

```bash
# Запуск полного цикла: сборка + деплой
./deploy-with-volumes.sh
```

Скрипт выполнит:
- Установку зависимостей
- Сборку SSR приложения
- Создание Docker образа
- Запуск контейнеров с volume mapping
- Проверку работоспособности

### 2. Ручной деплой

```bash
# Шаг 1: Сборка приложения
npm ci
npm run build:ssr

# Шаг 2: Запуск Docker
docker-compose up -d --build
```

## Конфигурация

### docker-compose.yml

```yaml
services:
  stacionar-app:
    build:
      context: .
      dockerfile: Dockerfile.production
    volumes:
      # Монтируем локально собранное приложение (только чтение)
      - ./dist:/app/dist:ro
      # Монтируем node_modules для быстрого старта
      - ./node_modules:/app/node_modules:ro
    ports:
      - "4000:4000"
```

### Dockerfile.production

Легковесный Dockerfile, который:
- Использует Node.js 18 Alpine (минимальный размер)
- Устанавливает только production зависимости
- Создает непривилегированного пользователя
- Настраивает healthcheck
- Ожидает готовую сборку через volume

## Управление

### Основные команды

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Перезапуск
docker-compose restart

# Просмотр логов
docker-compose logs -f

# Статус контейнеров
docker-compose ps

# Пересборка образа
docker-compose build --no-cache
```

### Обновление приложения

```bash
# Быстрое обновление (только код)
npm run build:ssr
docker-compose restart

# Полное обновление (с зависимостями)
./deploy-with-volumes.sh
```

## Мониторинг

### Проверка работоспособности

```bash
# Проверка HTTP ответа
curl -I http://localhost:4000

# Проверка SSR
curl -s http://localhost:4000 | grep -i "<title>"

# Проверка healthcheck
docker-compose ps
```

### Логи и отладка

```bash
# Логи приложения
docker-compose logs stacionar-app

# Логи в реальном времени
docker-compose logs -f stacionar-app

# Вход в контейнер для отладки
docker-compose exec stacionar-app sh

# Проверка монтированных файлов
docker-compose exec stacionar-app ls -la /app/dist
```

## Production деплой

### На сервере

```bash
# 1. Клонирование репозитория
git clone <your-repo>
cd stacionar-site

# 2. Настройка окружения
cp .env.example .env
# Отредактируйте .env файл

# 3. Деплой
./deploy-with-volumes.sh
```

### С nginx (рекомендуется)

Для production рекомендуется использовать nginx как reverse proxy:

```bash
# Раскомментируйте nginx секцию в docker-compose.yml
# Настройте SSL сертификаты
# Запустите с профилем production
docker-compose --profile production up -d
```

## Сравнение подходов

| Характеристика | Обычный Docker | Docker + Volumes |
|----------------|----------------|------------------|
| Время сборки | 5-10 минут | 2-3 минуты |
| Размер образа | ~500MB | ~150MB |
| Гибкость | Средняя | Высокая |
| Отладка | Сложная | Простая |
| Переиспользование | Низкое | Высокое |

## Устранение неполадок

### Частые проблемы

1. **Контейнер не запускается**
   ```bash
   # Проверьте логи
   docker-compose logs stacionar-app
   
   # Проверьте наличие сборки
   ls -la dist/stacionar-site/server/
   ```

2. **Файлы не обновляются**
   ```bash
   # Пересоберите приложение
   npm run build:ssr
   docker-compose restart
   ```

3. **Ошибки разрешений**
   ```bash
   # Проверьте права доступа
   ls -la dist/
   
   # При необходимости исправьте
   chmod -R 755 dist/
   ```

4. **Порт занят**
   ```bash
   # Найдите процесс на порту 4000
   lsof -i :4000
   
   # Остановите конфликтующий процесс
   docker-compose down
   ```

### Очистка

```bash
# Остановка и удаление контейнеров
docker-compose down

# Удаление образов
docker rmi $(docker images -q stacionar-site*)

# Очистка volumes
docker volume prune

# Полная очистка Docker
docker system prune -a
```

## Автоматизация CI/CD

Пример GitHub Actions для автоматического деплоя:

```yaml
name: Deploy with Volumes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Build application
        run: |
          npm ci
          npm run build:ssr
      
      - name: Deploy to server
        run: |
          # Копирование dist на сервер
          scp -r dist/ user@server:/path/to/app/
          
          # Перезапуск контейнера
          ssh user@server 'cd /path/to/app && docker-compose restart'
```

---

**Готово!** Теперь у вас есть оптимизированный Docker деплой с использованием volumes для быстрого и эффективного развертывания Angular SSR приложения.