import {Component, OnInit, OnDestroy, Inject, PLATFORM_ID} from '@angular/core';
import {ApiService} from "../../../api.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {SeoService} from "../../../seo-service.service";
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

import {CommonModule} from "@angular/common";
import {BreadcumbComponent} from "../../../layaot/breadcumb/breadcumb.component";
import {TabViewModule} from "primeng/tabview";
import {DiagnosesListComponent} from "../../../layaot/diagnoses-list/diagnoses-list.component";
import {RehabilitationComponent} from "../../../layaot/rehabilitation/rehabilitation.component";
import {AppointmentFormComponent} from "../../../layaot/appointment-form/appointment-form.component";


@Component({
  selector: 'app-stacionar',
  templateUrl: './stacionar.component.html',
  styleUrls: ['./stacionar.component.scss'],
  standalone:true,
  imports: [CommonModule,
    BreadcumbComponent,
    DiagnosesListComponent,
    RehabilitationComponent,
    TabViewModule,
    AppointmentFormComponent,
    ReactiveFormsModule,],
})
export class StacionarComponent implements OnInit, OnDestroy{
  constructor(
    private api:ApiService,
    private route: ActivatedRoute,
    private seo:SeoService, 
    private router: Router, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }
  gorod:any
  breadcrumbTitle: string = 'Стационар с лечением'
  citySlug: string = ''
  private countdownInterval: any
  
  // Переменные для модального окна и формы
  showBookingModal: boolean = false;
  isFormSubmitted: boolean = false;
  isFormLoading: boolean = false;
  bookingForm: FormGroup = new FormGroup({
    "name": new FormControl('', [Validators.required]),
    "phone": new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const cityParam = params.get('gorod');
      if(cityParam){
        this.citySlug = cityParam;
        this.api.get_gorod_by_slug(cityParam).subscribe(r=>{
          // @ts-ignore
          this.gorod=r.data
          // Обновляем заголовок хлебных крошек с названием города
          this.breadcrumbTitle = `Стационар с лечением ${this.gorod.attributes.cityIn}`;
          
          // Комплексная SEO-оптимизация для города
          this.setupCitySeo();
        })
      } else {
        // Если нет параметра города, показываем общую страницу
        this.breadcrumbTitle = 'Стационар с лечением';
        this.setupDefaultSeo();
      }
    })
    
    // Запускаем таймер обратного отсчета
    this.startCountdown();
  }

  /**
   * Настройка SEO для конкретного города
   */
  private setupCitySeo(): void {
    const cityName = this.gorod.attributes.cityTo;
    const cityIn = this.gorod.attributes.cityIn;
    
    const seoData = {
      title: `Стационар с лечением в ${cityName} - Реабилитационный центр "Новая Медицина"`,
      description: `Профессиональный стационар с лечением и реабилитацией в ${cityName}. Круглосуточный медицинский уход, современное оборудование, опытные врачи. Лечение после инсульта, травм, операций. Звоните!`,
      keywords: `стационар с лечением ${cityIn}, медицинский стационар ${cityIn}, реабилитация после инсульта ${cityIn}, лечение в стационаре ${cityIn}, медицинский центр ${cityIn}, стационарное лечение пожилых ${cityIn}, реабилитационный центр ${cityIn}, восстановление после травм ${cityIn}, круглосуточный медицинский уход ${cityIn}`,
      url: `https://nmrehab.ru/goroda/${this.citySlug}/stacionar`,
      type: 'website',
      image: 'https://nmrehab.ru/assets/img/stacionar-main.jpg'
    };
    
    this.seo.updateSeoData(seoData);
    this.addCityStructuredData();
  }

  /**
   * Настройка SEO по умолчанию
   */
  private setupDefaultSeo(): void {
    const seoData = {
      title: 'Стационар с лечением и реабилитацией - Медицинский центр "Новая Медицина"',
      description: 'Профессиональный стационар с лечением и реабилитацией. Круглосуточный медицинский уход, современное оборудование, опытные врачи. Лечение после инсульта, травм, операций по всей России.',
      keywords: 'стационар с лечением, медицинский стационар, реабилитация после инсульта, лечение в стационаре, медицинский центр, стационарное лечение пожилых, реабилитационный центр, восстановление после травм, круглосуточный медицинский уход',
      url: 'https://nmrehab.ru/stacionar',
      type: 'website',
      
    };
    
    this.seo.updateSeoData(seoData);
    this.addDefaultStructuredData();
  }

  /**
   * Добавление структурированных данных для города
   */
  private addCityStructuredData(): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      'name': `Стационар "Новая Медицина" в ${this.gorod.attributes.cityTo}`,
      'description': `Профессиональный медицинский стационар с лечением и реабилитацией в ${this.gorod.attributes.cityTo}`,
      'url': `https://nmrehab.ru/goroda/${this.citySlug}/stacionar`,
      'telephone': '8 (930) 033-22-228',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': this.gorod.attributes.cityTo,
        'addressCountry': 'RU'
      },
      'medicalSpecialty': [
        'Реабилитация',
        'Неврология', 
        'Кардиология',
        'Терапия',
        'Физиотерапия'
      ],
      'availableService': [
        {
          '@type': 'MedicalTherapy',
          'name': 'Реабилитация после инсульта',
          'description': 'Комплексная программа восстановления после инсульта'
        },
        {
          '@type': 'MedicalTherapy', 
          'name': 'Лечебная физкультура',
          'description': 'Индивидуальные и групповые занятия ЛФК'
        },
        {
          '@type': 'MedicalTherapy',
          'name': 'Физиотерапия',
          'description': 'Современные методы физиотерапевтического лечения'
        }
      ],
      'priceRange': '₽₽₽',
      'paymentAccepted': ['Cash', 'Credit Card'],
      'currenciesAccepted': 'RUB'
    };
    
    this.addJsonLd(structuredData);
  }

  /**
   * Добавление структурированных данных по умолчанию
   */
  private addDefaultStructuredData(): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      'name': 'Медицинский стационар "Новая Медицина"',
      'description': 'Профессиональный медицинский стационар с лечением и реабилитацией',
      'url': 'https://nmrehab.ru/stacionar',
      'telephone': '8 (930) 033-22-228',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'RU'
      },
      'medicalSpecialty': [
        'Реабилитация',
        'Неврология',
        'Кардиология', 
        'Терапия',
        'Физиотерапия'
      ],
      'priceRange': '₽₽₽'
    };
    
    this.addJsonLd(structuredData);
  }

  /**
   * Добавление JSON-LD структурированных данных
   */
  private addJsonLd(data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown(): void {
    // Устанавливаем дату окончания акции (сегодня + 4 дня)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 4);
    endDate.setHours(23, 59, 59, 999);

    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        // Обновляем элементы на странице
        if (isPlatformBrowser(this.platformId)) {
          const daysElement = document.getElementById('days');
          const hoursElement = document.getElementById('hours');
          const minutesElement = document.getElementById('minutes');

          if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
          if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
          if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        }
      } else {
        // Акция закончилась
        clearInterval(this.countdownInterval);
        if (isPlatformBrowser(this.platformId)) {
          const daysElement = document.getElementById('days');
          const hoursElement = document.getElementById('hours');
          const minutesElement = document.getElementById('minutes');

          if (daysElement) daysElement.textContent = '00';
          if (hoursElement) hoursElement.textContent = '00';
          if (minutesElement) minutesElement.textContent = '00';
        }
      }
    }, 1000);
  }

  getBreadcrumbs(): Array<{label: string, url?: string}> {
    const breadcrumbs: Array<{label: string, url?: string}> = [];
    
    // Добавляем ссылку на общую страницу стационара
    breadcrumbs.push({label: 'Стационар', url: '/stacionar'});
    
    // Если есть информация о городе, добавляем его в хлебные крошки
    if (this.gorod && this.gorod.attributes) {
      breadcrumbs.push({label: `${this.gorod.attributes.cityTo}`});
    } else if (this.citySlug) {
      // Если город еще загружается, показываем slug
      breadcrumbs.push({label: this.citySlug});
    }
    
    return breadcrumbs;
  }

  // Методы для управления модальным окном
  openBookingModal(): void {
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.isFormSubmitted = false;
  }

  // Форматирование номера телефона
  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value.startsWith('8')) {
        value = '7' + value.substring(1);
      }
      if (!value.startsWith('7')) {
        value = '7' + value;
      }
    }
    
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = '+7';
      if (value.length > 1) {
        formattedValue += ' (' + value.substring(1, 4);
        if (value.length > 4) {
          formattedValue += ') ' + value.substring(4, 7);
          if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 9);
            if (value.length > 9) {
              formattedValue += '-' + value.substring(9, 11);
            }
          }
        }
      }
    }
    
    event.target.value = formattedValue;
    this.bookingForm.patchValue({ phone: formattedValue });
  }

  // Отправка формы бронирования
  submitBookingForm(): void {
    if (this.bookingForm.valid) {
      this.isFormLoading = true;
      
      const formData = {
        name: this.bookingForm.value.name,
        phone: this.bookingForm.value.phone,
        message: 'Заявка на бронирование места по акционным ценам',
        form_type: 'booking_stacionar'
      };

    
          
          // Отправляем уведомления в Telegram во все настроенные чаты
          if (environment.telegramBotToken && environment.telegramChatIds && 
              environment.telegramBotToken !== 'YOUR_BOT_TOKEN_HERE' && 
              environment.telegramChatIds.length > 0) {
            
            const telegramMessage = `🏥 Новая заявка на бронирование места по акционным ценам\n\n👤 Имя: ${formData.name}\n📞 Телефон: ${formData.phone}\n\n📅 Время подачи: ${new Date().toLocaleString('ru-RU')}`;
            
            // Отправляем сообщение во все чаты из массива
            environment.telegramChatIds.forEach((chatId: string, index: number) => {
              if (chatId && chatId !== 'YOUR_CHAT_ID_HERE') {
                this.api.send_telegram(parseInt(chatId), telegramMessage).subscribe({
                  next: (telegramResponse) => {
                    console.log(`Уведомление в Telegram отправлено успешно в чат ${chatId}`);
                  },
                  error: (telegramError) => {
                    console.error(`Ошибка отправки уведомления в Telegram для чата ${chatId}:`, telegramError);
                  }
                });
              }
            });
          }
          
          this.isFormLoading = false;
          this.isFormSubmitted = true;
       
    
    }
  }

  // Сброс формы для повторной отправки
  resetBookingForm(): void {
    this.isFormSubmitted = false;
    this.bookingForm.reset();
  }

}
