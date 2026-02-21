# Инструкция по развертыванию Angular SSR приложения в production

## Предварительные требования

- Node.js 18+ установлен на сервере
- nginx установлен и настроен
- PM2 для управления процессами
- SSL сертификат (рекомендуется Let's Encrypt)
- Доступ к серверу по SSH

## 1. Подготовка приложения

### Сборка для production

```bash
# Установка зависимостей
npm ci

# Сборка SSR приложения
npm run build:ssr
```

Это создаст папку `dist/` с:
- `dist/stacionar-site/browser/` - клиентские файлы
- `dist/stacionar-site/server/` - серверные файлы для SSR

## 2. Настройка сервера

### Копирование файлов на сервер

```bash
# Создание директории на сервере
ssh user@your-server "mkdir -p /var/www/stacionar-site"

# Копирование собранного приложения
scp -r dist/ user@your-server:/var/www/stacionar-site/
scp package.json user@your-server:/var/www/stacionar-site/
scp ecosystem.config.js user@your-server:/var/www/stacionar-site/
```

### Установка зависимостей на сервере

```bash
ssh user@your-server
cd /var/www/stacionar-site
npm ci --production
```

## 3. Настройка PM2

### Создание ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'stacionar-ssr',
    script: './dist/stacionar-site/server/server.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Запуск приложения

```bash
# Создание директории для логов
mkdir -p logs

# Запуск через PM2
pm2 start ecosystem.config.js

# Сохранение конфигурации
pm2 save

# Автозапуск при перезагрузке сервера
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## 4. Настройка nginx

### Создание конфигурации сайта

Создайте файл `/etc/nginx/sites-available/stacionar-site`:

```nginx
# Редирект с HTTP на HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# Основная конфигурация HTTPS
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL конфигурация
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Основная директория со статическими файлами
    root /var/www/stacionar-site/dist/stacionar-site/browser;
    index index.html;
    
    # Логи
    access_log /var/log/nginx/stacionar-site.access.log;
    error_log /var/log/nginx/stacionar-site.error.log;
    
    # Статические файлы (JS, CSS, изображения)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
        try_files $uri =404;
    }
    
    # Специальные файлы
    location = /robots.txt {
        try_files $uri =404;
    }
    
    location = /sitemap.xml {
        try_files $uri =404;
    }
    
    location = /favicon.ico {
        try_files $uri =404;
    }
    
    # Основная логика маршрутизации
    location / {
        try_files $uri $uri/ @ssr;
    }
    
    # Проксирование к SSR серверу
    location @ssr {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

### Активация конфигурации

```bash
# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/stacionar-site /etc/nginx/sites-enabled/

# Удаление дефолтной конфигурации (если нужно)
sudo rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
sudo nginx -t

# Перезагрузка nginx
sudo systemctl reload nginx
```

## 5. Настройка SSL с Let's Encrypt

```bash
# Установка Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Проверка автоматического обновления
sudo certbot renew --dry-run

# Настройка автоматического обновления
sudo crontab -e
# Добавить строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 6. Мониторинг и управление

### Команды PM2

```bash
# Просмотр статуса
pm2 status

# Просмотр логов
pm2 logs stacionar-ssr
pm2 logs stacionar-ssr --lines 100

# Перезапуск приложения
pm2 restart stacionar-ssr

# Остановка приложения
pm2 stop stacionar-ssr

# Удаление приложения из PM2
pm2 delete stacionar-ssr

# Мониторинг в реальном времени
pm2 monit
```

### Логи nginx

```bash
# Просмотр логов доступа
sudo tail -f /var/log/nginx/stacionar-site.access.log

# Просмотр логов ошибок
sudo tail -f /var/log/nginx/stacionar-site.error.log

# Общие логи nginx
sudo tail -f /var/log/nginx/error.log
```

## 7. Автоматизация деплоя

### Создание скрипта деплоя

Создайте файл `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Переменные
SERVER_USER="your-user"
SERVER_HOST="your-server.com"
APP_DIR="/var/www/stacionar-site"
APP_NAME="stacionar-ssr"

# Сборка приложения локально
echo "📦 Building application..."
npm ci
npm run build:ssr

# Создание архива
echo "📁 Creating deployment archive..."
tar -czf deploy.tar.gz dist/ package.json ecosystem.config.js

# Копирование на сервер
echo "📤 Uploading to server..."
scp deploy.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# Развертывание на сервере
echo "🔧 Deploying on server..."
ssh $SERVER_USER@$SERVER_HOST << EOF
    cd $APP_DIR
    
    # Остановка приложения
    pm2 stop $APP_NAME || true
    
    # Создание бэкапа
    if [ -d "dist" ]; then
        mv dist dist.backup.\$(date +%Y%m%d_%H%M%S)
    fi
    
    # Распаковка нового кода
    tar -xzf /tmp/deploy.tar.gz
    
    # Установка зависимостей
    npm ci --production
    
    # Запуск приложения
    pm2 start $APP_NAME
    
    # Очистка
    rm /tmp/deploy.tar.gz
EOF

# Очистка локальных файлов
rm deploy.tar.gz

echo "✅ Deployment completed successfully!"
echo "🌐 Your site is available at: https://your-domain.com"
```

Сделайте скрипт исполняемым:

```bash
chmod +x deploy.sh
```

### Использование скрипта деплоя

```bash
# Запуск деплоя
./deploy.sh
```

## 8. Проверка работоспособности

### Проверка SSR

```bash
# Проверка, что сервер отвечает
curl -I https://your-domain.com

# Проверка SSR (должен вернуть HTML с контентом)
curl -s https://your-domain.com | grep -i "<title>"
```

### Проверка производительности

```bash
# Проверка времени ответа
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
```

Создайте файл `curl-format.txt`:

```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

## 9. Устранение неполадок

### Частые проблемы

1. **Приложение не запускается**
   ```bash
   pm2 logs stacionar-ssr
   ```

2. **502 Bad Gateway**
   - Проверьте, что PM2 процесс запущен
   - Проверьте порт в nginx конфигурации

3. **SSL проблемы**
   ```bash
   sudo certbot certificates
   sudo nginx -t
   ```

4. **Высокое потребление памяти**
   ```bash
   pm2 monit
   # Настройте max_memory_restart в ecosystem.config.js
   ```

### Полезные команды

```bash
# Проверка портов
sudo netstat -tlnp | grep :4000
sudo netstat -tlnp | grep :443

# Проверка процессов
ps aux | grep node

# Проверка дискового пространства
df -h

# Проверка использования памяти
free -h
```

## 10. Резервное копирование

### Создание бэкапа

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/stacionar-site"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Бэкап приложения
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C /var/www stacionar-site

# Бэкап конфигурации nginx
cp /etc/nginx/sites-available/stacionar-site $BACKUP_DIR/nginx_$DATE.conf

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.conf" -mtime +30 -delete

echo "Backup created: $BACKUP_DIR/app_$DATE.tar.gz"
```

---

**Готово!** Ваше Angular SSR приложение развернуто в production с nginx, PM2 и SSL.

Для получения помощи обращайтесь к логам и используйте команды мониторинга выше.