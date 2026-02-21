#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Конфигурация API
const API_HOST = 'front-api.nmpansion.ru';
const API_TOKEN = process.env.API_TOKEN || ''; // Token should be provided as an environment variable
const BASE_URL = 'https://nmrehab.ru';

const SITEMAP_PATH = path.join(__dirname, '../src/sitemap.xml');

// Статические маршруты (соответствуют app.routes.ts)
const STATIC_ROUTES = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/contact', changefreq: 'monthly', priority: '0.8' },
  { url: '/service', changefreq: 'weekly', priority: '0.9' },
  { url: '/price', changefreq: 'weekly', priority: '0.9' },
  { url: '/staff', changefreq: 'weekly', priority: '0.8' },
  { url: '/diagnos', changefreq: 'monthly', priority: '0.7' },
  { url: '/rehabilitation', changefreq: 'monthly', priority: '0.7' },
  { url: '/video-reviews', changefreq: 'weekly', priority: '0.7' },
  { url: '/license', changefreq: 'monthly', priority: '0.6' },
  { url: '/transport', changefreq: 'monthly', priority: '0.6' },
  { url: '/patient/raczion', changefreq: 'monthly', priority: '0.5' }
];

// Функция для выполнения HTTPS запросов
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          console.warn(`Ошибка парсинга JSON для ${path}:`, error.message);
          resolve({ data: [] });
        }
      });
    });
    
    req.on('error', (error) => {
      console.warn(`Ошибка запроса для ${path}:`, error.message);
      resolve({ data: [] });
    });
    
    req.setTimeout(10000, () => {
      console.warn(`Таймаут запроса для ${path}`);
      req.destroy();
      resolve({ data: [] });
    });
    
    req.end();
  });
}

// Функция для получения всех данных с пагинацией
async function getAllPaginatedData(endpoint, params = {}) {
  let allData = [];
  let start = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const queryParams = new URLSearchParams({
      ...params,
      'pagination[start]': start,
      'pagination[limit]': limit,
      'pagination[withCount]': 'false'
    });
    
    const path = `${endpoint}?${queryParams.toString()}`;
    const response = await makeRequest(path);
    
    if (response.data && Array.isArray(response.data)) {
      allData = allData.concat(response.data);
      
      // Если получили меньше данных чем лимит, значит это последняя страница
      if (response.data.length < limit) {
        hasMore = false;
      } else {
        start += limit;
      }
    } else {
      hasMore = false;
    }
  }
  
  return { data: allData };
}

// Функция для получения текущей даты в формате ISO
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Функция для создания URL элемента sitemap
function createUrlElement(url, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Основная функция генерации sitemap
async function generateSitemap() {
  console.log('🚀 Начинаем генерацию sitemap...');
  
  const currentDate = getCurrentDate();
  let urls = [];
  let totalPages = 0;

  // Добавляем статические маршруты
  STATIC_ROUTES.forEach(route => {
    urls.push(createUrlElement(route.url, currentDate, route.changefreq, route.priority));
    totalPages++;
  });
  console.log(`✅ Добавлено статических страниц: ${STATIC_ROUTES.length}`);

  try {
    // Получаем данные о персонале (staff-detail/:slug)
    console.log('📋 Получаем список персонала...');
    const staffData = await getAllPaginatedData('/api/personals', { fields: 'slug' });
    if (Array.isArray(staffData.data) && staffData.data.length > 0) {
      staffData.data.forEach(staff => {
        const slug = staff.attributes?.slug ?? staff.slug ?? staff.id;
        if (slug) {
          urls.push(createUrlElement(`/staff-detail/${slug}`, currentDate, 'monthly', '0.6'));
          totalPages++;
        }
      });
      console.log(`✅ Добавлено страниц персонала: ${staffData.data.length}`);
    }

    // Получаем данные о городах
    console.log('🏙️ Получаем список городов...');
    const citiesData = await getAllPaginatedData('/api/gorodas', { fields: 'slug' });
    
    if (Array.isArray(citiesData.data) && citiesData.data.length > 0) {
      citiesData.data.forEach(city => {
        if (city.attributes && city.attributes.slug) {
          const citySlug = city.attributes.slug;
          urls.push(createUrlElement(`/dom-prestarelyh/${citySlug}`, currentDate, 'monthly', '0.7'));
          urls.push(createUrlElement(`/stacionar/${citySlug}`, currentDate, 'monthly', '0.7'));
           urls.push(createUrlElement(`/reabilitaciya-posle-insultov/${citySlug}`, currentDate, 'monthly', '0.7'));
          totalPages += 2;
        }
      });
      console.log(`✅ Добавлено страниц городов: ${citiesData.data.length * 2} (${citiesData.data.length} для /dom-prestarelyh/, ${citiesData.data.length} для /stacionar/ и ${citiesData.data.length} для /reabilitaciya-posle-insultov/)`);
    }
    

    // Получаем данные о диагнозах (diagnos/:slug)
    console.log('🏥 Получаем список диагнозов...');
    const diagnosesData = await getAllPaginatedData('/api/statis', {
      'filters[category][$eq]': 'Диагнозы',
      'fields': 'slug'
    });
    if (Array.isArray(diagnosesData.data) && diagnosesData.data.length > 0) {
      diagnosesData.data.forEach(diagnosis => {
        if (diagnosis.attributes && diagnosis.attributes.slug) {
          const diagnosisSlug = diagnosis.attributes.slug;
          urls.push(createUrlElement(`/diagnos/${diagnosisSlug}`, currentDate, 'monthly', '0.8'));
          totalPages++;
        }
      });
      console.log(`✅ Добавлено страниц диагнозов: ${diagnosesData.data.length}`);
    }

    // Получаем данные о реабилитации
    console.log('🏃‍♂️ Получаем список программ реабилитации...');
    const rehabData = await getAllPaginatedData('/api/statis', {
      'filters[category][$eq]': 'Реабилитация',
      'fields': 'slug'
    });
    if (Array.isArray(rehabData.data) && rehabData.data.length > 0) {
      rehabData.data.forEach(rehab => {
        if (rehab.attributes && rehab.attributes.slug) {
          const rehabSlug = rehab.attributes.slug;
          urls.push(createUrlElement(`/rehabilitation/${rehabSlug}`, currentDate, 'monthly', '0.8'));
          totalPages++;
        }
      });
      console.log(`✅ Добавлено страниц реабилитации: ${rehabData.data.length}`);
    }

  } catch (error) {
    console.error('❌ Ошибка при получении данных из API:', error.message);
    console.log('⚠️ Продолжаем с базовыми маршрутами...');
  }

  // Создаем XML содержимое
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  // Записываем файл
  try {
    fs.writeFileSync(SITEMAP_PATH, xmlContent, 'utf8');
    console.log(`🎉 Sitemap успешно обновлен!`);
    console.log(`📊 Всего страниц в sitemap: ${totalPages}`);
    console.log(`📁 Файл сохранен: ${SITEMAP_PATH}`);
  } catch (error) {
    console.error('❌ Ошибка при записи sitemap:', error.message);
    process.exit(1);
  }
}

// Запускаем генерацию
if (require.main === module) {
  generateSitemap().catch(error => {
    console.error('❌ Критическая ошибка:', error.message);
    process.exit(1);
  });
}

module.exports = { generateSitemap };