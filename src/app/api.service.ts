import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import emailjs from '@emailjs/browser';
import { TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from './environments/environment';
import { CacheService, CacheKeyBuilder } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  host: string = environment.apiHost;
  header = new HttpHeaders({ Authorization: `Bearer ${environment.apiToken}` });

  private readonly CACHE_TTL = {
    STATIC: 30 * 60 * 1000,
    DYNAMIC: 5 * 60 * 1000,
    PERSONAL: 15 * 60 * 1000,
    MEDIA: 60 * 60 * 1000
  };

  constructor(
    private http: HttpClient,
    private cacheService: CacheService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Запрос с TransferState: на сервере сохраняем ответ, на клиенте при гидрации читаем и не дублируем запрос.
   */
  private getWithTransferState<T>(
    stateKeyStr: string,
    cacheKey: string,
    requestFn: () => Observable<T>,
    ttl: number
  ): Observable<T> {
    const stateKey = makeStateKey<T>(stateKeyStr);
    if (isPlatformBrowser(this.platformId)) {
      const stored = this.transferState.get(stateKey, null);
      if (stored !== null) {
        this.transferState.remove(stateKey);
        return of(stored);
      }
    }
    const request$ = requestFn();
    if (isPlatformServer(this.platformId)) {
      return request$.pipe(
        tap((data) => this.transferState.set(stateKey, data))
      );
    }
    return this.cacheService.get(cacheKey, () => request$, ttl);
  }


  get_video_rewiew(): Observable<any> {
    const cacheKey = CacheKeyBuilder.forApi('/file-system/docs/VideoReview');
    return this.cacheService.get(
      cacheKey,
      () => this.http.get(`${this.host}/file-system/docs/VideoReview`, {headers: this.header}),
      this.CACHE_TTL.MEDIA
    );
  }

  get_video_rewiew_no_cache(): Observable<any> {
    return this.http.get(`${this.host}/file-system/docs/VideoReview`, {headers: this.header});
  }

  get_photos(): Observable<any> {
    const cacheKey = CacheKeyBuilder.forApi('/file-system/docs/photo');
    return this.cacheService.get(
      cacheKey,
      () => this.http.get(`${this.host}/file-system/docs/photo`, {headers: this.header}),
      this.CACHE_TTL.MEDIA
    );
  }

  get_goroda_list(): Observable<any> {
    const stateKeyStr = 'api.gorodas.list';
    const cacheKey = CacheKeyBuilder.forApi('/api/gorodas', { pagination: { pageSize: 800 }, fields: ['name', 'slug'] });
    return this.getWithTransferState(
      stateKeyStr,
      cacheKey,
      () => this.http.get(`${this.host}/api/gorodas/?pagination[pageSize]=800&fields=name&fields=slug`, { headers: this.header }),
      this.CACHE_TTL.STATIC
    );
  }

  get_personal_list(): Observable<any> {
    const stateKeyStr = 'api.personals.list';
    const cacheKey = CacheKeyBuilder.forApi('/api/personals', { populate: 'dolzhnosti_sotrudnikovs,img', sort: 'name' });
    return this.getWithTransferState(
      stateKeyStr,
      cacheKey,
      () => this.http.get(`${this.host}/api/personals?populate[dolzhnosti_sotrudnikovs][fields]=title&populate[img]=url&sort[0]=name`, { headers: this.header }),
      this.CACHE_TTL.PERSONAL
    );
  }

  det_personal_detail(slug: string): Observable<any> {
    const encodedSlug = encodeURIComponent(slug);
    const stateKeyStr = `api.personals.detail.${encodedSlug}`;
    const cacheKey = CacheKeyBuilder.forApi(`/api/personals/${encodedSlug}`);
    return this.getWithTransferState(
      stateKeyStr,
      cacheKey,
      () => this.http.get(`${this.host}/api/personals/${encodedSlug}`, { headers: this.header }),
      this.CACHE_TTL.PERSONAL
    );
  }

  // Методы отправки данных не кэшируются
  send_form_data(data: any): Observable<any> {
    console.log('🚀 Отправка формы:', {
      url: `${this.host}/api/ezforms/submit`,
      data: data,
      headers: this.header
    });
    
    return this.http.post(`${this.host}/api/ezforms/submit`, {'formData': data}, {headers: this.header})
      .pipe(
        tap(response => {
          console.log('✅ Успешный ответ от API:', response);
        }),
        catchError(error => {
          console.error('❌ Ошибка API запроса:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            message: error.message,
            error: error.error
          });
          return throwError(() => error);
        })
      );
  }

  send_telegram(chat_id: number, message: string): Observable<any> {
    return this.http.get(`https://api.telegram.org/bot${environment.telegramBotToken || ''}/sendMessage?chat_id=${chat_id}&parse_mode=HTML&text=${encodeURIComponent(message)}`);
  }

  /**
   * Отправляет уведомление о заявке в Telegram + на email через EmailJS.
   * Все ключи берутся из environment.ts — менять только там.
   */
  sendFormNotification(name: string, phone: string, subject: string): void {
    const chatId = parseInt(environment.telegramChatIds?.[0] || '505467091', 10);
    const msg = `${subject}\nИмя: ${name}\nТелефон: ${phone}\n📅 ${new Date().toLocaleString('ru-RU')}`;

    // Telegram (работает в России)
    this.send_telegram(chatId, msg).subscribe({
      error: (e) => console.error('Telegram notification error:', e)
    });

    // Email через EmailJS (работает в России, Яндекс SMTP)
    if (isPlatformBrowser(this.platformId)) {
      const { serviceId, templateId, publicKey } = environment.emailjs;
      if (serviceId && templateId && publicKey) {
        emailjs.send(serviceId, templateId, {
          from_name: name,
          phone,
          subject,
          message: msg,
          to_email: environment.notificationEmail,
        }, publicKey).catch((e: any) => console.error('EmailJS error:', e));
      }
    }
  }

  get_diagnoses(): Observable<any> {
    const category = encodeURIComponent('Диагнозы');
    const stateKeyStr = 'api.statis.diagnoses.list';
    const cacheKey = CacheKeyBuilder.forApi('/api/statis', { category: 'Диагнозы', pagination: { limit: 100 }, fields: ['title', 'slug'], sort: 'title:asc' });
    return this.getWithTransferState(
      stateKeyStr,
      cacheKey,
      () => this.http.get(`${this.host}/api/statis?filters[category][$eq]=${category}&pagination[limit]=100&fields=title&fields=slug&sort[0]=title:asc`, { headers: this.header }),
      this.CACHE_TTL.STATIC
    );
  }

  get_rehabilitationlist(): Observable<any> {
    const category = encodeURIComponent('Реабилитация');
    const stateKeyStr = 'api.statis.rehabilitation.list';
    const cacheKey = CacheKeyBuilder.forApi('/api/statis', { category: 'Реабилитация', pagination: { limit: 200 }, fields: ['title', 'slug'], sort: 'title:asc' });
    return this.getWithTransferState(
      stateKeyStr,
      cacheKey,
      () => this.http.get(`${this.host}/api/statis?filters[category][$eq]=${category}&pagination[limit]=200&fields=title&fields=slug&sort[0]=title:asc`, { headers: this.header }),
      this.CACHE_TTL.STATIC
    );
  }

  get_price_page(): Observable<any> {
    const cacheKey = CacheKeyBuilder.forApi('/api/statis/price');
    return this.cacheService.get(
      cacheKey,
      () => this.http.get(`${this.host}/api/statis/price`, {headers: this.header}),
      this.CACHE_TTL.STATIC
    );
  }

  get_gorod_by_slug(slug: string): Observable<any> {
    const encodedSlug = encodeURIComponent(slug);
    const stateKeyStr = `api.gorodas.detail.${encodedSlug}`;
    const cacheKey = CacheKeyBuilder.forApi(`/api/gorodas/${encodedSlug}`);
    return this.getWithTransferState(
      stateKeyStr,
      cacheKey,
      () => this.http.get(`${this.host}/api/gorodas/${encodedSlug}`, { headers: this.header }),
      this.CACHE_TTL.STATIC
    );
  }

  get_diagnos_detail_by_slug(slug: string): Observable<any> {
    const encodedSlug = encodeURIComponent(slug);
    const stateKeyStr = `api.statis.detail.${encodedSlug}`;
    const cacheKey = CacheKeyBuilder.forApi(`/api/statis/${encodedSlug}`);
    return this.getWithTransferState(
      stateKeyStr,
      cacheKey,
      () => this.http.get(`${this.host}/api/statis/${encodedSlug}`, { headers: this.header }),
      this.CACHE_TTL.STATIC
    );
  }

  get_article_detail(slug: string): Observable<any> {
    const encodedSlug = encodeURIComponent(slug);
    const cacheKey = CacheKeyBuilder.forApi(`/api/statis/${encodedSlug}`);
    return this.cacheService.get(
      cacheKey,
      () => this.http.get(`${this.host}/api/statis/${encodedSlug}`, {headers: this.header}),
      this.CACHE_TTL.STATIC
    );
  }

  get_service_list(): Observable<any> {
    const cacheKey = CacheKeyBuilder.forApi('/api/uslugis', { fields: ['name', 'slug'], populate: 'img', sort: 'name' });
    return this.cacheService.get(
      cacheKey,
      () => this.http.get(`${this.host}/api/uslugis/?fields=name&fields=slug&populate[img]=url&sort[0]=name`, {headers: this.header}),
      this.CACHE_TTL.STATIC
    );
  }

  // Методы для инвалидации кэша
  invalidateCache(pattern?: string): void {
    if (pattern) {
      this.cacheService.invalidatePattern(pattern);
    } else {
      this.cacheService.clear();
    }
  }

  // Предварительная загрузка критических данных
  preloadCriticalData(): void {
    this.get_personal_list().subscribe();
    this.get_goroda_list().subscribe();
    this.get_diagnoses().subscribe();
    this.get_rehabilitationlist().subscribe();
  }

  // Получить статистику кэша
  getCacheStats() {
    return this.cacheService.getCacheStats();
  }


}
