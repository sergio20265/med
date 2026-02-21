const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');
const https = require('https');

// API конфигурация
const API_HOST = 'https://front-api.nmpansion.ru';
const API_TOKEN = process.env.API_TOKEN || ''; // Token should be provided as an environment variable
const DOMAIN = 'https://nmrehab.ru';

// Статические маршруты
const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/service', changefreq: 'monthly', priority: 0.8 },
  { url: '/price', changefreq: 'monthly', priority: 0.7 },
  { url: '/staff', changefreq: 'weekly', priority: 0.8 },
  { url: '/diagnos', changefreq: 'weekly', priority: 0.7 },
  { url: '/rehabilitation', changefreq: 'weekly', priority: 0.7 },
  { url: '/transport', changefreq: 'monthly', priority: 0.6 },
  { url: '/license', changefreq: 'yearly', priority: 0.5 },
  { url: '/video-reviews', changefreq: 'weekly', priority: 0.6 },
  { url: '/patient/raczion', changefreq: 'monthly', priority: 0.5 }
];

// Функция для выполнения API запросов
function makeApiRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    };
    
    https.get(`${API_HOST}${endpoint}`, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function generateSitemap() {
  try {
    console.log('Начинаем генерацию карты сайта...');
    
    const sitemap = new SitemapStream({ hostname: DOMAIN });
    const writeStream = createWriteStream(resolve(__dirname, 'src/sitemap.xml'));
    sitemap.pipe(writeStream);

    // Добавляем статические маршруты
    console.log('Добавляем статические маршруты...');
    for (const route of staticRoutes) {
      sitemap.write({
        url: route.url,
        changefreq: route.changefreq,
        priority: route.priority,
        lastmod: new Date().toISOString()
      });
    }

    // Получаем и добавляем персонал
    console.log('Получаем данные персонала...');
    try {
      const personalData = await makeApiRequest('/api/personals?populate[dolzhnosti_sotrudnikovs][fields]=title&populate[img]=url&sort[0]=name&pagination[pageSize]=200');
      if (personalData.data) {
        personalData.data.forEach(person => {
          if (person.attributes && person.attributes.slug) {
            sitemap.write({
              url: `/staff-detail/${person.attributes.slug}`,
              changefreq: 'monthly',
              priority: 0.6,
              lastmod: person.attributes.updatedAt || new Date().toISOString()
            });
          }
        });
        console.log(`Добавлено ${personalData.data.length} страниц персонала`);
      }
    } catch (error) {
      console.warn('Ошибка при получении данных персонала:', error.message);
    }

    // Получаем и добавляем города
    console.log('Получаем данные городов...');
    try {
      const gorodaData = await makeApiRequest('/api/gorodas/?pagination[pageSize]=800&fields=name&fields=slug');
      if (gorodaData.data) {
        gorodaData.data.forEach(gorod => {
          if (gorod.attributes && gorod.attributes.slug) {
            sitemap.write({
              url: `/stacionar/${gorod.attributes.slug}`,
              changefreq: 'monthly',
              priority: 0.7,
              lastmod: gorod.attributes.updatedAt || new Date().toISOString()
            });
            sitemap.write({
              url: `/dom-prestarelyh/${gorod.attributes.slug}`,
              changefreq: 'monthly',
              priority: 0.6,
              lastmod: gorod.attributes.updatedAt || new Date().toISOString()
            });
          }
        });
        console.log(`Добавлено ${gorodaData.data.length * 2} страниц городов`);
      }
    } catch (error) {
      console.warn('Ошибка при получении данных городов:', error.message);
    }

    // Получаем и добавляем диагнозы
    console.log('Получаем данные диагнозов...');
    try {
      const diagnosesData = await makeApiRequest('/api/statis?filters[category][$eq]=Диагнозы&pagination[limit]=100&fields=title&fields=slug&sort[0]=title:asc');
      if (diagnosesData.data) {
        diagnosesData.data.forEach(diagnos => {
          if (diagnos.attributes && diagnos.attributes.slug) {
            sitemap.write({
              url: `/diagnos/${diagnos.attributes.slug}`,
              changefreq: 'monthly',
              priority: 0.6,
              lastmod: diagnos.attributes.updatedAt || new Date().toISOString()
            });
          }
        });
        console.log(`Добавлено ${diagnosesData.data.length} страниц диагнозов`);
      }
    } catch (error) {
      console.warn('Ошибка при получении данных диагнозов:', error.message);
    }

    // Получаем и добавляем реабилитацию
    console.log('Получаем данные реабилитации...');
    try {
      const rehabilitationData = await makeApiRequest('/api/statis?filters[category][$eq]=Реабилитация&pagination[limit]=200&fields=title&fields=slug&sort[0]=title:asc');
      if (rehabilitationData.data) {
        rehabilitationData.data.forEach(rehab => {
          if (rehab.attributes && rehab.attributes.slug) {
            sitemap.write({
              url: `/rehabilitation/${rehab.attributes.slug}`,
              changefreq: 'monthly',
              priority: 0.6,
              lastmod: rehab.attributes.updatedAt || new Date().toISOString()
            });
          }
        });
        console.log(`Добавлено ${rehabilitationData.data.length} страниц реабилитации`);
      }
    } catch (error) {
      console.warn('Ошибка при получении данных реабилитации:', error.message);
    }

    sitemap.end();
    await streamToPromise(sitemap);
    console.log('✅ Карта сайта успешно создана в src/sitemap.xml');
    
  } catch (error) {
    console.error('❌ Ошибка при создании карты сайта:', error);
    process.exit(1);
  }
}

// Запускаем генерацию
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };
