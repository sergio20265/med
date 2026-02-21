import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from './environments/environment';
import { ContactsComponent } from './pages/contacts/contacts.component';

const BASE_URL = environment.baseUrl;

import { IndexComponent } from './pages/index/index.component';
import { PriceListComponent } from './pages/price-list/price-list.component';
import { ServiceComponent } from './pages/service/service.component';
import { StaffComponent } from './pages/staff/staff.component';
import { StaffDetailComponent } from './pages/staff/staff-detail/staff-detail.component';
import { StacionarComponent } from './pages/goroda/stacionar/stacionar.component';
import { DomPrestarelComponent } from './pages/goroda/dom-prestarel/dom-prestarel.component';
import { DiagnosComponent } from './pages/diagnos/diagnos.component';
import { ArticleComponent } from './pages/article/article.component';
import { RaczionComponent } from './pages/raczion/raczion.component';
import { DiagnosesListComponent } from './layaot/diagnoses-list/diagnoses-list.component';
import { RehabilitationComponent } from './layaot/rehabilitation/rehabilitation.component';
import { VideoReviewsComponent } from './pages/video-reviews/video-reviews.component';
import { LicenseComponent } from './pages/license/license.component';
import { TransportComponent } from './pages/transport/transport.component';
import { ErrorComponent } from './pages/error/error.component';
import { ReabilitaciyaPosleInsultovComponent } from './pages/goroda/reabilitaciya-posle-insultov/reabilitaciya-posle-insultov.component';
// import {GoradaListComponent} from "./pages/goroda/gorada-list/gorada-list.component";

const appRoutes: Routes = [
  {
    path: '',
    component: IndexComponent,
    data: {
      title: 'Частный стационар "Новая медицина" - Медицинский центр',
      description: 'Частный стационар "Новая медицина" - современный медицинский центр с полным спектром услуг. Квалифицированные врачи, комфортные условия, индивидуальный подход к каждому пациенту.',
      keywords: 'частный стационар, новая медицина, медицинский центр, лечение, врачи, Москва, медицинские услуги, госпитализация',
      canonical: `${BASE_URL}/`
    },
  },
  {
    path: 'contact',
    component: ContactsComponent,
    data: {
      title: 'Контакты - Частный стационар "Новая медицина"',
      description: 'Контактная информация частного стационара "Новая медицина". Адрес, телефоны, режим работы, схема проезда. Запись на консультацию и госпитализацию.',
      keywords: 'контакты, адрес, телефон, запись, консультация, частный стационар, новая медицина',
      canonical: `${BASE_URL}/contact`
    },
  },
  { 
    path: 'service', 
    component: ServiceComponent, 
    data: {
      title: 'Медицинские услуги - Частный стационар "Новая медицина"',
      description: 'Полный спектр медицинских услуг в частном стационаре "Новая медицина". Диагностика, лечение, реабилитация, профилактика. Современное оборудование и опытные специалисты.',
      keywords: 'медицинские услуги, диагностика, лечение, реабилитация, стационар, врачи, медицина',
      canonical: `${BASE_URL}/service`
    } 
  },
  { 
    path: 'price', 
    component: PriceListComponent, 
    data: {
      title: 'Цены на медицинские услуги - Частный стационар "Новая медицина"',
      description: 'Прайс-лист на медицинские услуги частного стационара "Новая медицина". Доступные цены на диагностику, лечение, госпитализацию и реабилитацию.',
      keywords: 'цены, прайс, стоимость, медицинские услуги, лечение, диагностика, госпитализация',
      canonical: `${BASE_URL}/price`
    } 
  },
  { 
    path: 'stacionar', 
    component: StacionarComponent,
    data: {
      title: 'Частный стационар - Медицинские центры по городам',
      description: 'Сеть частных стационаров "Новая медицина" в различных городах. Выберите ближайший медицинский центр для получения качественной медицинской помощи.',
      keywords: 'частный стационар, медицинские центры, города, филиалы, новая медицина',
      canonical: `${BASE_URL}/stacionar`
    }
  },
  {
    path: 'stacionar/:gorod',
    component: StacionarComponent,
    data: {
      title: 'Частный стационар в городе - Новая медицина',
      description: 'Частный стационар "Новая медицина" в вашем городе. Современное медицинское оборудование, квалифицированные врачи, комфортные палаты.',
      keywords: 'частный стационар, медицинский центр, лечение, врачи, госпитализация'
    }
  },
  {
    path: 'stacionar/:gorod/diagnos/:slug',
    component: DiagnosComponent,
    data: {
      title: 'Лечение диагноза в стационаре - Новая медицина',
      description: 'Профессиональное лечение различных заболеваний в частном стационаре "Новая медицина". Индивидуальный подход, современные методы терапии.',
      keywords: 'лечение, диагноз, заболевание, стационар, терапия, врачи'
    }
  },
  {
    path: 'stacionar/:gorod/rehabilitation/:slug',
    component: DiagnosComponent,
    data: {
      title: 'Реабилитация в стационаре - Новая медицина',
      description: 'Комплексная реабилитация в частном стационаре "Новая медицина". Восстановительное лечение, физиотерапия, индивидуальные программы реабилитации.',
      keywords: 'реабилитация, восстановление, физиотерапия, стационар, лечение'
    }
  },
  {
    path: 'dom-prestarelyh/:gorod',
    component: DomPrestarelComponent,
    data: {
      title: 'Дом престарелых - Уход за пожилыми людьми',
      description: 'Частный дом престарелых "Новая медицина". Профессиональный уход за пожилыми людьми, медицинское наблюдение, комфортные условия проживания.',
      keywords: 'дом престарелых, уход за пожилыми, пансионат, медицинский уход, престарелые'
    }
  },
  {
    path: 'reabilitaciya-posle-insultov/:gorod',
    component: ReabilitaciyaPosleInsultovComponent,
    data: {
      title: 'Реабилитация после инсульта - Восстановление в стационаре',
      description: 'Комплексная реабилитация после инсульта в частном стационаре "Новая медицина". Индивидуальные программы восстановления, современные методы реабилитации.',
      keywords: 'реабилитация после инсульта, восстановление, инсульт, стационар, реабилитационный центр'
    }
  },
  {
    path: 'staff',
    component: StaffComponent,
    data: {
      title: 'Медицинский персонал - Врачи стационара "Новая медицина"',
      description: 'Команда опытных врачей и медицинского персонала частного стационара "Новая медицина". Высокая квалификация, многолетний опыт работы.',
      keywords: 'врачи, медицинский персонал, специалисты, квалификация, опыт, команда',
      canonical: `${BASE_URL}/staff`
    }
  },
  {
    path: 'diagnos',
    component: DiagnosesListComponent,
    data: {
      title: 'Медицинские диагнозы - Лечение заболеваний в стационаре',
      description: 'Полный перечень медицинских диагнозов, которые лечат в частном стационаре "Новая медицина". Профессиональная диагностика и эффективное лечение.',
      keywords: 'диагнозы, заболевания, лечение, медицинская диагностика, болезни, терапия',
      canonical: `${BASE_URL}/diagnos`
    },
  },
  {
    path: 'rehabilitation',
    component: RehabilitationComponent,
    data: {
      title: 'Медицинская реабилитация - Виды восстановительного лечения',
      description: 'Различные виды медицинской реабилитации в частном стационаре "Новая медицина". Физиотерапия, ЛФК, массаж, восстановительные программы.',
      keywords: 'реабилитация, восстановление, физиотерапия, ЛФК, массаж, восстановительное лечение',
      canonical: `${BASE_URL}/rehabilitation`
    },
  },
  {
    path: 'rehabilitation/:slug',
    component: DiagnosComponent,
    data: {
      title: 'Программа реабилитации - Восстановительное лечение',
      description: 'Индивидуальная программа медицинской реабилитации в частном стационаре "Новая медицина". Комплексный подход к восстановлению здоровья.',
      keywords: 'программа реабилитации, восстановительное лечение, индивидуальный подход, реабилитация'
    },
  },
  {
    path: 'diagnos/:slug',
    component: DiagnosComponent,
    data: {
      title: 'Лечение заболевания - Медицинская помощь в стационаре',
      description: 'Профессиональное лечение конкретного заболевания в частном стационаре "Новая медицина". Современные методы диагностики и терапии.',
      keywords: 'лечение заболевания, медицинская помощь, диагностика, терапия, стационарное лечение'
    },
  },
  {
    path: 'video-reviews',
    component: VideoReviewsComponent,
    data: {
      title: 'Видео отзывы пациентов - Частный стационар "Новая медицина"',
      description: 'Видео отзывы пациентов о лечении в частном стационаре "Новая медицина". Реальные истории выздоровления и благодарности.',
      keywords: 'видео отзывы, отзывы пациентов, благодарности, истории выздоровления, пациенты',
      canonical: `${BASE_URL}/video-reviews`
    },
  },
  {
    path: 'license',
    component: LicenseComponent,
    data: {
      title: 'Лицензия на медицинскую деятельность - Новая медицина',
      description: 'Лицензия на осуществление медицинской деятельности частного стационара "Новая медицина". Официальные документы и разрешения.',
      keywords: 'лицензия, медицинская деятельность, разрешения, документы, официальная медицина',
      canonical: `${BASE_URL}/license`
    }
  },
  {
    path: 'transport',
    component: TransportComponent,
    data: {
      title: 'Медицинская транспортировка пациентов - Новая медицина',
      description: 'Услуги медицинской транспортировки пациентов от частного стационара "Новая медицина". Безопасная перевозка больных, скорая помощь.',
      keywords: 'медицинская транспортировка, перевозка больных, скорая помощь, транспорт пациентов',
      canonical: `${BASE_URL}/transport`
    },
  },
  {
    path: 'staff-detail/:slug',
    component: StaffDetailComponent,
    data: {
      title: 'Врач стационара - Медицинский специалист',
      description: 'Подробная информация о враче частного стационара "Новая медицина". Квалификация, опыт работы, специализация.',
      keywords: 'врач, медицинский специалист, квалификация, опыт, специализация'
    }
  },
  {
    path: 'patient/raczion',
    component: RaczionComponent,
    data: {
      title: 'Рацион питания для пациентов - Лечебное питание в стационаре',
      description: 'Сбалансированный рацион питания для пациентов частного стационара "Новая медицина". Лечебные диеты, индивидуальное меню.',
      keywords: 'рацион питания, лечебное питание, диета, меню для пациентов, питание в стационаре',
      canonical: `${BASE_URL}/patient/raczion`
    },
  },
  {
    path: 'error',
    component: ErrorComponent,
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
