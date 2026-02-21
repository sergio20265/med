import {ApplicationConfig, provideZoneChangeDetection, importProvidersFrom} from '@angular/core';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideClientHydration} from '@angular/platform-browser';
import {provideRouter, PreloadAllModules, withPreloading} from '@angular/router';
import {MetrikaModule} from 'ng-yandex-metrika';
// import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

// Import routes from app.routes.ts
import {ContactsComponent} from "./pages/contacts/contacts.component";
import {IndexComponent} from "./pages/index/index.component";
import {PriceListComponent} from "./pages/price-list/price-list.component";
import {ServiceComponent} from "./pages/service/service.component";
import {StaffComponent} from "./pages/staff/staff.component";
import {StaffDetailComponent} from "./pages/staff/staff-detail/staff-detail.component";
import {StacionarComponent} from "./pages/goroda/stacionar/stacionar.component";
import {DomPrestarelComponent} from "./pages/goroda/dom-prestarel/dom-prestarel.component";
import {DiagnosComponent} from "./pages/diagnos/diagnos.component";
import {ArticleComponent} from "./pages/article/article.component";
import {RaczionComponent} from "./pages/raczion/raczion.component";
import {DiagnosesListComponent} from "./layaot/diagnoses-list/diagnoses-list.component";
import {RehabilitationComponent} from "./layaot/rehabilitation/rehabilitation.component";
import {VideoReviewsComponent} from "./pages/video-reviews/video-reviews.component";
import {LicenseComponent} from "./pages/license/license.component";
import {TransportComponent} from "./pages/transport/transport.component";
import {Routes} from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    component: IndexComponent,
    data: { 
      title: 'Частный стационар "Новая медицина" - Медицинский центр в Москве',
      description: 'Частный стационар "Новая медицина" - современный медицинский центр с полным спектром услуг. Квалифицированные врачи, комфортные условия, индивидуальный подход к каждому пациенту.',
      keywords: 'частный стационар, новая медицина, медицинский центр, лечение, врачи, Москва, медицинские услуги, госпитализация',
      canonical: 'https://stacionar-site.ru/'
    },
  },
  {
    path: 'contact',
    component: ContactsComponent,
    data: { 
      title: 'Контакты - Частный стационар "Новая медицина"',
      description: 'Контактная информация частного стационара "Новая медицина". Адрес, телефоны, режим работы, схема проезда. Запись на консультацию и госпитализацию.',
      keywords: 'контакты, адрес, телефон, запись, консультация, частный стационар, новая медицина',
      canonical: 'https://stacionar-site.ru/contact'
    },
  },
  { 
    path: 'service', 
    component: ServiceComponent, 
    data: { 
      title: 'Медицинские услуги - Частный стационар "Новая медицина"',
      description: 'Полный спектр медицинских услуг в частном стационаре "Новая медицина". Диагностика, лечение, реабилитация, профилактика. Современное оборудование и опытные специалисты.',
      keywords: 'медицинские услуги, диагностика, лечение, реабилитация, стационар, врачи, медицина',
      canonical: 'https://stacionar-site.ru/service'
    } 
  },
  { 
    path: 'price', 
    component: PriceListComponent, 
    data: { 
      title: 'Цены на медицинские услуги - Частный стационар "Новая медицина"',
      description: 'Прайс-лист на медицинские услуги частного стационара "Новая медицина". Доступные цены на диагностику, лечение, госпитализацию и реабилитацию.',
      keywords: 'цены, прайс, стоимость, медицинские услуги, лечение, диагностика, госпитализация',
      canonical: 'https://stacionar-site.ru/price'
    } 
  },
  { 
    path: 'staff', 
    component: StaffComponent, 
    data: { 
      title: 'Медицинский персонал - Врачи стационара "Новая медицина"',
      description: 'Команда опытных врачей и медицинского персонала частного стационара "Новая медицина". Высокая квалификация, многолетний опыт работы.',
      keywords: 'врачи, медицинский персонал, специалисты, квалификация, опыт, команда',
      canonical: 'https://stacionar-site.ru/staff'
    } 
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    provideClientHydration(),
    provideHttpClient(), // Временно отключен withFetch() для диагностики
    // Yandex Metrika configuration
    importProvidersFrom(
      MetrikaModule.forRoot({
        id: 96483162,
        webvisor: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        defer: true
      })
    ),
    // provideAnimationsAsync(),
        // providePrimeNG({
        //     theme: {
        //         preset: Aura,
        //
        //     }
        // })


  ],
};
