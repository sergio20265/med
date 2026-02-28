import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from './environments/environment';

const BASE_URL = environment.baseUrl;

const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/index/index.component').then(m => m.IndexComponent),
    data: {
      title: 'Частный стационар "Новая медицина" - Медицинский центр',
      description: 'Частный стационар "Новая медицина" - современный медицинский центр с полным спектром услуг. Квалифицированные врачи, комфортные условия, индивидуальный подход к каждому пациенту.',
      keywords: 'частный стационар, новая медицина, медицинский центр, лечение, врачи, Москва, медицинские услуги, госпитализация',
      canonical: `${BASE_URL}/`
    },
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contacts/contacts.component').then(m => m.ContactsComponent),
    data: {
      title: 'Контакты реабилитационного стационара «Новая медицина»',
      description: 'Адрес, телефон, режим работы. Владимирская область, пос. Городищи, ул. Больничный проезд, д. 1. Звоните +7 (930) 033-22-22.',
      keywords: 'контакты, адрес, телефон, запись, консультация, реабилитационный стационар, новая медицина',
      canonical: `${BASE_URL}/contact`
    },
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    data: {
      title: 'О нас — Реабилитационный стационар «Новая медицина»',
      description: 'Реабилитационный стационар в составе сети медицинских центров «Новая медицина». Более 15 лет работы, 9 медицинских центров, официальная лицензия.',
      keywords: 'о нас, реабилитационный стационар, Новая медицина, история, о центре',
      canonical: `${BASE_URL}/about`
    },
  },
  {
    path: 'service',
    loadComponent: () => import('./pages/service/service.component').then(m => m.ServiceComponent),
    data: {
      title: 'Медицинские услуги - Частный стационар "Новая медицина"',
      description: 'Полный спектр медицинских услуг в частном стационаре "Новая медицина". Диагностика, лечение, реабилитация, профилактика. Современное оборудование и опытные специалисты.',
      keywords: 'медицинские услуги, диагностика, лечение, реабилитация, стационар, врачи, медицина',
      canonical: `${BASE_URL}/service`
    }
  },
  {
    path: 'price',
    loadComponent: () => import('./pages/price-list/price-list.component').then(m => m.PriceListComponent),
    data: {
      title: 'Цены на медицинские услуги - Частный стационар "Новая медицина"',
      description: 'Прайс-лист на медицинские услуги частного стационара "Новая медицина". Доступные цены на диагностику, лечение, госпитализацию и реабилитацию.',
      keywords: 'цены, прайс, стоимость, медицинские услуги, лечение, диагностика, госпитализация',
      canonical: `${BASE_URL}/price`
    }
  },
  {
    path: 'stacionar',
    loadComponent: () => import('./pages/goroda/stacionar/stacionar.component').then(m => m.StacionarComponent),
    data: {
      title: 'Частный стационар - Медицинские центры по городам',
      description: 'Сеть частных стационаров "Новая медицина" в различных городах. Выберите ближайший медицинский центр для получения качественной медицинской помощи.',
      keywords: 'частный стационар, медицинские центры, города, филиалы, новая медицина',
      canonical: `${BASE_URL}/stacionar`
    }
  },
  {
    path: 'stacionar/:gorod',
    loadComponent: () => import('./pages/goroda/stacionar/stacionar.component').then(m => m.StacionarComponent),
    data: {
      title: 'Частный стационар в городе - Новая медицина',
      description: 'Частный стационар "Новая медицина" в вашем городе. Современное медицинское оборудование, квалифицированные врачи, комфортные палаты.',
      keywords: 'частный стационар, медицинский центр, лечение, врачи, госпитализация'
    }
  },
  {
    path: 'stacionar/:gorod/diagnos/:slug',
    loadComponent: () => import('./pages/diagnos/diagnos.component').then(m => m.DiagnosComponent),
    data: {
      title: 'Лечение диагноза в стационаре - Новая медицина',
      description: 'Профессиональное лечение различных заболеваний в частном стационаре "Новая медицина". Индивидуальный подход, современные методы терапии.',
      keywords: 'лечение, диагноз, заболевание, стационар, терапия, врачи'
    }
  },
  {
    path: 'stacionar/:gorod/rehabilitation/:slug',
    loadComponent: () => import('./pages/diagnos/diagnos.component').then(m => m.DiagnosComponent),
    data: {
      title: 'Реабилитация в стационаре - Новая медицина',
      description: 'Комплексная реабилитация в частном стационаре "Новая медицина". Восстановительное лечение, физиотерапия, индивидуальные программы реабилитации.',
      keywords: 'реабилитация, восстановление, физиотерапия, стационар, лечение'
    }
  },
  {
    path: 'dom-prestarelyh/:gorod',
    loadComponent: () => import('./pages/goroda/dom-prestarel/dom-prestarel.component').then(m => m.DomPrestarelComponent),
    data: {
      title: 'Дом престарелых - Уход за пожилыми людьми',
      description: 'Частный дом престарелых "Новая медицина". Профессиональный уход за пожилыми людьми, медицинское наблюдение, комфортные условия проживания.',
      keywords: 'дом престарелых, уход за пожилыми, пансионат, медицинский уход, престарелые'
    }
  },
  {
    path: 'reabilitaciya-posle-insultov/:gorod',
    loadComponent: () => import('./pages/goroda/reabilitaciya-posle-insultov/reabilitaciya-posle-insultov.component').then(m => m.ReabilitaciyaPosleInsultovComponent),
    data: {
      title: 'Реабилитация после инсульта - Восстановление в стационаре',
      description: 'Комплексная реабилитация после инсульта в частном стационаре "Новая медицина". Индивидуальные программы восстановления, современные методы реабилитации.',
      keywords: 'реабилитация после инсульта, восстановление, инсульт, стационар, реабилитационный центр'
    }
  },
  {
    path: 'staff',
    loadComponent: () => import('./pages/staff/staff.component').then(m => m.StaffComponent),
    data: {
      title: 'Медицинский персонал - Врачи стационара "Новая медицина"',
      description: 'Команда опытных врачей и медицинского персонала частного стационара "Новая медицина". Высокая квалификация, многолетний опыт работы.',
      keywords: 'врачи, медицинский персонал, специалисты, квалификация, опыт, команда',
      canonical: `${BASE_URL}/staff`
    }
  },
  {
    path: 'diagnos',
    loadComponent: () => import('./layaot/diagnoses-list/diagnoses-list.component').then(m => m.DiagnosesListComponent),
    data: {
      title: 'Медицинские диагнозы - Лечение заболеваний в стационаре',
      description: 'Полный перечень медицинских диагнозов, которые лечат в частном стационаре "Новая медицина". Профессиональная диагностика и эффективное лечение.',
      keywords: 'диагнозы, заболевания, лечение, медицинская диагностика, болезни, терапия',
      canonical: `${BASE_URL}/diagnos`
    },
  },
  {
    path: 'rehabilitation',
    loadComponent: () => import('./layaot/rehabilitation/rehabilitation.component').then(m => m.RehabilitationComponent),
    data: {
      title: 'Медицинская реабилитация - Виды восстановительного лечения',
      description: 'Различные виды медицинской реабилитации в частном стационаре "Новая медицина". Физиотерапия, ЛФК, массаж, восстановительные программы.',
      keywords: 'реабилитация, восстановление, физиотерапия, ЛФК, массаж, восстановительное лечение',
      canonical: `${BASE_URL}/rehabilitation`
    },
  },
  // ── Статические лендинги направлений (до параметрических роутов) ──
  {
    path: 'rehabilitation/insult',
    loadComponent: () => import('./pages/direction/direction.component').then(m => m.DirectionComponent),
    data: {
      slug: 'insult',
      title: 'Реабилитация после инсульта в стационаре 24/7 | Новая медицина',
      canonical: `${BASE_URL}/rehabilitation/insult`
    },
  },
  {
    path: 'rehabilitation/perelom-shejki-bedra',
    loadComponent: () => import('./pages/direction/direction.component').then(m => m.DirectionComponent),
    data: {
      slug: 'perelom-shejki-bedra',
      title: 'Реабилитация после перелома шейки бедра | Новая медицина',
      canonical: `${BASE_URL}/rehabilitation/perelom-shejki-bedra`
    },
  },
  {
    path: 'rehabilitation/endoprotezirovanie',
    loadComponent: () => import('./pages/direction/direction.component').then(m => m.DirectionComponent),
    data: {
      slug: 'endoprotezirovanie',
      title: 'Реабилитация после эндопротезирования сустава | Новая медицина',
      canonical: `${BASE_URL}/rehabilitation/endoprotezirovanie`
    },
  },
  {
    path: 'diagnos/demenciya',
    loadComponent: () => import('./pages/direction/direction.component').then(m => m.DirectionComponent),
    data: {
      slug: 'demenciya',
      title: 'Уход при деменции и болезни Альцгеймера 24/7 | Новая медицина',
      canonical: `${BASE_URL}/diagnos/demenciya`
    },
  },
  {
    path: 'diagnos/parkinson',
    loadComponent: () => import('./pages/direction/direction.component').then(m => m.DirectionComponent),
    data: {
      slug: 'parkinson',
      title: 'Уход при болезни Паркинсона 24/7 | Новая медицина',
      canonical: `${BASE_URL}/diagnos/parkinson`
    },
  },
  {
    path: 'diagnos/palliativ',
    loadComponent: () => import('./pages/direction/direction.component').then(m => m.DirectionComponent),
    data: {
      slug: 'palliativ',
      title: 'Паллиативная помощь в стационаре 24/7 | Новая медицина',
      canonical: `${BASE_URL}/diagnos/palliativ`
    },
  },
  // ── Обобщённый роут реабилитации (API) ──────────────────────
  {
    path: 'rehabilitation/:slug',
    loadComponent: () => import('./pages/diagnos/diagnos.component').then(m => m.DiagnosComponent),
    data: {
      title: 'Программа реабилитации - Восстановительное лечение',
      description: 'Индивидуальная программа медицинской реабилитации в частном стационаре "Новая медицина". Комплексный подход к восстановлению здоровья.',
      keywords: 'программа реабилитации, восстановительное лечение, индивидуальный подход, реабилитация'
    },
  },
  {
    path: 'diagnos/:slug',
    loadComponent: () => import('./pages/diagnos/diagnos.component').then(m => m.DiagnosComponent),
    data: {
      title: 'Лечение заболевания - Медицинская помощь в стационаре',
      description: 'Профессиональное лечение конкретного заболевания в частном стационаре "Новая медицина". Современные методы диагностики и терапии.',
      keywords: 'лечение заболевания, медицинская помощь, диагностика, терапия, стационарное лечение'
    },
  },
  {
    path: 'video-reviews',
    loadComponent: () => import('./pages/video-reviews/video-reviews.component').then(m => m.VideoReviewsComponent),
    data: {
      title: 'Отзывы о стационаре Новая Медицина',
      description: 'Истории пациентов после инсульта, переломов и операций. Реальные отзывы родственников.',
      keywords: 'видео отзывы, отзывы пациентов, благодарности, истории выздоровления, пациенты',
      canonical: `${BASE_URL}/video-reviews`
    },
  },
  {
    path: 'license',
    loadComponent: () => import('./pages/license/license.component').then(m => m.LicenseComponent),
    data: {
      title: 'Лицензия и документы стационара',
      description: 'Официальная медицинская лицензия, реквизиты и документы. Работаем по договору.',
      keywords: 'лицензия, медицинская деятельность, разрешения, документы, официальная медицина',
      canonical: `${BASE_URL}/license`
    }
  },
  {
    path: 'transport',
    loadComponent: () => import('./pages/transport/transport.component').then(m => m.TransportComponent),
    data: {
      title: 'Медицинская транспортировка пациентов - Новая медицина',
      description: 'Услуги медицинской транспортировки пациентов от частного стационара "Новая медицина". Безопасная перевозка больных, скорая помощь.',
      keywords: 'медицинская транспортировка, перевозка больных, скорая помощь, транспорт пациентов',
      canonical: `${BASE_URL}/transport`
    },
  },
  {
    path: 'staff-detail/:slug',
    loadComponent: () => import('./pages/staff/staff-detail/staff-detail.component').then(m => m.StaffDetailComponent),
    data: {
      title: 'Врач стационара - Медицинский специалист',
      description: 'Подробная информация о враче частного стационара "Новая медицина". Квалификация, опыт работы, специализация.',
      keywords: 'врач, медицинский специалист, квалификация, опыт, специализация'
    }
  },
  {
    path: 'patient/raczion',
    loadComponent: () => import('./pages/raczion/raczion.component').then(m => m.RaczionComponent),
    data: {
      title: 'Рацион питания для пациентов - Лечебное питание в стационаре',
      description: 'Сбалансированный рацион питания для пациентов частного стационара "Новая медицина". Лечебные диеты, индивидуальное меню.',
      keywords: 'рацион питания, лечебное питание, диета, меню для пациентов, питание в стационаре',
      canonical: `${BASE_URL}/patient/raczion`
    },
  },
  {
    path: 'error',
    loadComponent: () => import('./pages/error/error.component').then(m => m.ErrorComponent),
    data: {
      type: 404,
      title: 'Страница не найдена - Частный стационар "Новая медицина"',
      description: 'Запрашиваемая страница не найдена. Вернитесь на главную страницу частного стационара "Новая медицина" или воспользуйтесь навигацией сайта.',
      keywords: 'страница не найдена, ошибка 404, частный стационар',
      canonical: `${BASE_URL}/error`,
      robots: 'noindex, nofollow',
      desc: 'Извините, запрашиваемая страница не существует.',
    },
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'top',
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutes {}
