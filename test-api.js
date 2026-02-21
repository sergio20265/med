const https = require('https');
const http = require('http');

// Тестируем API запрос с токеном
const testApiRequest = () => {
  const data = JSON.stringify({
    formData: {
      name: 'Test User',
      phone: '+7 (999) 123-45-67'
    }
  });

  const options = {
    hostname: 'front-api.nmpansion.ru',
    port: 443,
    path: '/api/ezforms/submit',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': 'Bearer 0cacc14d6b6cc78223a8197c01a61c69388c27cf6e8bde1ed36b08625720e5e4094cff52f0608f54b74112dd212813362bec1a0590b67dd73737890a2c7b9d801a4caebeb9a690e28b37adf8861e549f365be427e2c5924e7233cf3e9894a31ed49884b2e500e8cb6527b05fa6e6a3d20c8276a68481e3a2542facd8d1b85570',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Origin': 'https://stacionar-site.vercel.app',
      'Referer': 'https://stacionar-site.vercel.app/'
    }
  };

  console.log('Отправляем запрос к API...');
  console.log('URL:', `https://${options.hostname}${options.path}`);
  console.log('Headers:', options.headers);
  console.log('Data:', data);

  const req = https.request(options, (res) => {
    console.log(`\nОтвет от сервера:`);
    console.log(`Статус: ${res.statusCode}`);
    console.log(`Заголовки:`, res.headers);

    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('\nТело ответа:', responseData);
      
      if (res.statusCode === 403) {
        console.log('\n❌ Получена ошибка 403 - доступ запрещен');
        console.log('Возможные причины:');
        console.log('1. Неверный токен авторизации');
        console.log('2. Токен истек');
        console.log('3. CORS проблемы');
        console.log('4. Неправильные заголовки запроса');
        console.log('5. IP адрес заблокирован');
      } else if (res.statusCode === 200) {
        console.log('\n✅ Запрос выполнен успешно!');
      } else {
        console.log(`\n⚠️ Неожиданный статус: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (error) => {
    console.error('\n❌ Ошибка запроса:', error.message);
  });

  req.write(data);
  req.end();
};

// Тестируем также простой GET запрос для проверки доступности API
const testApiAvailability = () => {
  const options = {
    hostname: 'front-api.nmpansion.ru',
    port: 443,
    path: '/api/v2',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer 0cacc14d6b6cc78223a8197c01a61c69388c27cf6e8bde1ed36b08625720e5e4094cff52f0608f54b74112dd212813362bec1a0590b67dd73737890a2c7b9d801a4caebeb9a690e28b37adf8861e549f365be427e2c5924e7233cf3e9894a31ed49884b2e500e8cb6527b05fa6e6a3d20c8276a68481e3a2542facd8d1b85570'
    }
  };

  console.log('\n=== Проверяем доступность API ===');
  
  const req = https.request(options, (res) => {
    console.log(`Статус проверки доступности: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Ответ:', responseData.substring(0, 200) + '...');
      
      // После проверки доступности, тестируем основной запрос
      console.log('\n=== Тестируем отправку формы ===');
      testApiRequest();
    });
  });

  req.on('error', (error) => {
    console.error('Ошибка проверки доступности:', error.message);
    // Все равно пробуем основной запрос
    console.log('\n=== Тестируем отправку формы ===');
    testApiRequest();
  });

  req.end();
};

// Запускаем тесты
testApiAvailability();