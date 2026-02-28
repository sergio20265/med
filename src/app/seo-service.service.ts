import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from './environments/environment';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export type SchemaPageType = 'organization' | 'physician' | 'article' | 'medicalBusiness';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  robots?: string;
  /** Тип схемы для JSON-LD: организация (по умолчанию), врач, статья, медицинский бизнес */
  schemaType?: SchemaPageType;
  /** Хлебные крошки для BreadcrumbList */
  breadcrumbs?: BreadcrumbItem[];
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly baseUrl = environment.baseUrl;
  private readonly defaultImage = `${environment.baseUrl}/assets/img/logo.png`;
  private readonly siteName = 'Стационар "Новая медицина"';

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateSeoData(seoData: SeoData): void {
    // Обновляем заголовок
    if (seoData.title) {
      this.updateTitle(seoData.title);
    }

    // Обновляем описание
    if (seoData.description) {
      this.updateDescription(seoData.description);
    }

    // Обновляем ключевые слова
    if (seoData.keywords) {
      this.updateKeyWords(seoData.keywords);
    }

    // Robots (noindex для 404 и т.п.)
    if (seoData.robots !== undefined) {
      this.updateRobots(seoData.robots);
    }

    // Обновляем Open Graph теги
    this.updateOpenGraphTags(seoData);

    // Обновляем Twitter Card теги
    this.updateTwitterCardTags(seoData);

    // Обновляем канонический URL (работает и на сервере для SSR)
    this.updateCanonicalUrl(seoData.url);

    // Добавляем структурированные данные (работает и на сервере для SSR)
    this.addStructuredData(seoData);
  }

  updateRobots(content: string): void {
    this.meta.updateTag({ name: 'robots', content });
  }

  updateTitle(title: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
  }

  updateDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  updateKeyWords(keywords: string): void {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  private updateOpenGraphTags(seoData: SeoData): void {
    const currentUrl = seoData.url ?? `${this.baseUrl}${this.router.url}`;
    const image = seoData.image || this.defaultImage;
    const type = seoData.type || 'website';

    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:locale', content: 'ru_RU' });

    if (seoData.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: seoData.publishedTime });
    }

    if (seoData.modifiedTime) {
      this.meta.updateTag({ property: 'article:modified_time', content: seoData.modifiedTime });
    }

    if (seoData.author) {
      this.meta.updateTag({ property: 'article:author', content: seoData.author });
    }
  }

  private updateTwitterCardTags(seoData: SeoData): void {
    const image = seoData.image || this.defaultImage;

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@nmrehab' });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  private updateCanonicalUrl(url?: string): void {
    const canonicalUrl = url ?? `${this.baseUrl}${this.router.url}`;

    // Удаляем существующий канонический тег
    const existingCanonical = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Добавляем новый канонический тег (работает и на сервере для SSR)
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    this.document.head.appendChild(link);
  }

  private addStructuredData(seoData: SeoData): void {
    const currentUrl = seoData.url ?? `${this.baseUrl}${this.router.url}`;
    const schemaType = seoData.schemaType ?? 'organization';

    const organization: Record<string, unknown> = {
      '@type': ['MedicalOrganization', 'MedicalClinic'],
      '@id': `${this.baseUrl}/#organization`,
      name: 'Реабилитационный стационар «Новая медицина»',
      alternateName: 'НМ Реабилитация',
      url: this.baseUrl,
      logo: { '@type': 'ImageObject', url: this.defaultImage },
      image: `${this.baseUrl}/assets/img/stacionar-main/book_bg.webp`,
      description: 'Частный реабилитационный стационар с круглосуточным медицинским наблюдением. Реабилитация после инсульта, переломов, операций. Уход при деменции и болезни Паркинсона.',
      telephone: '+7-930-033-22-22',
      email: 'nmpansion@yandex.ru',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Больничный проезд, д. 1',
        addressLocality: 'пос. Городищи',
        addressRegion: 'Владимирская область',
        postalCode: '601005',
        addressCountry: 'RU'
      },
      openingHours: 'Mo-Su 00:00-24:00',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+7-930-033-22-22',
          contactType: 'customer service',
          availableLanguage: 'Russian'
        }
      ],
      medicalSpecialty: ['Реабилитация', 'Неврология', 'Паллиативная помощь', 'Гериатрия'],
      sameAs: ['https://t.me/+dnM4EbcdmwM3ZjAy'],
      hasMap: 'https://yandex.ru/maps/?ll=40.35,56.14&z=15'
    };

    let pageEntity: Record<string, unknown> | null = null;
    if (schemaType === 'physician' && seoData.title) {
      pageEntity = {
        '@type': 'Physician',
        '@id': `${currentUrl}#physician`,
        name: seoData.title.split(' - ')[0] ?? seoData.title,
        description: seoData.description,
        image: seoData.image ?? this.defaultImage,
        url: currentUrl,
        worksFor: { '@id': `${this.baseUrl}/#organization` }
      };
    } else if (schemaType === 'article' && seoData.title) {
      pageEntity = {
        '@type': 'Article',
        '@id': `${currentUrl}#article`,
        headline: seoData.title,
        description: seoData.description,
        image: seoData.image ?? this.defaultImage,
        url: currentUrl,
        author: seoData.author ? { '@type': 'Person', name: seoData.author } : undefined,
        datePublished: seoData.publishedTime,
        dateModified: seoData.modifiedTime,
        publisher: { '@id': `${this.baseUrl}/#organization` }
      };
    } else if (schemaType === 'medicalBusiness' && seoData.title) {
      pageEntity = {
        '@type': 'MedicalBusiness',
        '@id': `${currentUrl}#localbusiness`,
        name: seoData.title,
        description: seoData.description,
        url: currentUrl,
        image: seoData.image ?? this.defaultImage,
        parentOrganization: { '@id': `${this.baseUrl}/#organization` }
      };
    }

    let breadcrumbList: Record<string, unknown> | null = null;
    if (seoData.breadcrumbs && seoData.breadcrumbs.length > 0) {
      breadcrumbList = {
        '@type': 'BreadcrumbList',
        '@id': `${currentUrl}#breadcrumb`,
        itemListElement: seoData.breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };
    }

    const graph = [organization];
    if (pageEntity) graph.push(pageEntity);
    if (breadcrumbList) graph.push(breadcrumbList);

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': graph
    };

    const existingScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(el => el.remove());

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }

  // Метод для медицинских статей
  updateMedicalArticleSeo(data: {
    title: string;
    description: string;
    author?: string;
    publishedDate?: string;
    modifiedDate?: string;
    medicalCondition?: string;
    breadcrumbs?: BreadcrumbItem[];
  }): void {
    const keywords = `${data.medicalCondition || ''}, лечение, реабилитация, стационар, медицина`;
    this.updateSeoData({
      title: `${data.title} | ${this.siteName}`,
      description: data.description,
      keywords,
      type: 'article',
      schemaType: 'article',
      author: data.author,
      publishedTime: data.publishedDate,
      modifiedTime: data.modifiedDate,
      breadcrumbs: data.breadcrumbs
    });
  }

  // Метод для страниц персонала
  updateStaffSeo(data: {
    name: string;
    position: string;
    description: string;
    image?: string;
    breadcrumbs?: BreadcrumbItem[];
  }): void {
    this.updateSeoData({
      title: `${data.name} - ${data.position} | ${this.siteName}`,
      description: data.description,
      keywords: `${data.name}, ${data.position}, врач, медицина, стационар`,
      type: 'profile',
      schemaType: 'physician',
      image: data.image,
      breadcrumbs: data.breadcrumbs
    });
  }

  // Метод для страниц городов
  updateCitySeo(data: {
    cityName: string;
    serviceType: string;
    description: string;
    breadcrumbs?: BreadcrumbItem[];
  }): void {
    this.updateSeoData({
      title: `${data.serviceType} в ${data.cityName} | ${this.siteName}`,
      description: data.description,
      keywords: `${data.serviceType}, ${data.cityName}, стационар, лечение, реабилитация`,
      type: 'website',
      schemaType: 'medicalBusiness',
      breadcrumbs: data.breadcrumbs
    });
  }

  /** Полная разметка главной страницы: WebSite + MedicalClinic + FAQPage */
  updateHomepageSeo(faqs: { question: string; answer: string }[]): void {
    // Стандартные мета-теги
    this.updateSeoData({
      title: 'Реабилитационный стационар для пожилых 24/7',
      description: 'Стационар после инсульта, переломов и операций. Уход и реабилитация 24/7. От 2000 ₽/сутки. Есть свободные места.',
      keywords: 'реабилитационный стационар, реабилитация после инсульта, перелом шейки бедра, деменция, болезнь Паркинсона, паллиативная помощь, уход за лежачими',
      url: `${this.baseUrl}/`,
      schemaType: 'organization'
    });

    // Очищаем старые ld+json
    this.document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());

    const graph: Record<string, unknown>[] = [
      // 1. WebSite
      {
        '@type': 'WebSite',
        '@id': `${this.baseUrl}/#website`,
        url: this.baseUrl,
        name: 'Реабилитационный стационар «Новая медицина»',
        inLanguage: 'ru-RU',
        publisher: { '@id': `${this.baseUrl}/#organization` }
      },
      // 2. MedicalClinic (полная карточка клиники)
      {
        '@type': ['MedicalClinic', 'LocalBusiness'],
        '@id': `${this.baseUrl}/#clinic`,
        name: 'Реабилитационный стационар «Новая медицина»',
        alternateName: 'НМ Реабилитация',
        url: this.baseUrl,
        logo: { '@type': 'ImageObject', url: `${this.baseUrl}/assets/img/logo.png` },
        image: `${this.baseUrl}/assets/img/stacionar-main/book_bg.webp`,
        description: 'Частный реабилитационный стационар с круглосуточным медицинским наблюдением. Реабилитация после инсульта, переломов, операций. Уход при деменции и болезни Паркинсона.',
        telephone: '+7-930-033-22-22',
        email: 'nmpansion@yandex.ru',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ул. Больничный проезд, д. 1',
          addressLocality: 'пос. Городищи',
          addressRegion: 'Владимирская область',
          postalCode: '601005',
          addressCountry: 'RU'
        },
        openingHours: 'Mo-Su 00:00-24:00',
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
          opens: '00:00',
          closes: '23:59'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+7-930-033-22-22',
          contactType: 'customer service',
          availableLanguage: 'Russian'
        },
        medicalSpecialty: ['Реабилитация', 'Неврология', 'Паллиативная помощь', 'Гериатрия'],
        hasCredential: 'Лицензия №ЛО-33-01-003878',
        sameAs: ['https://t.me/+dnM4EbcdmwM3ZjAy'],
        priceRange: 'от 2000 ₽/сутки',
        currenciesAccepted: 'RUB',
        paymentAccepted: 'Наличный расчёт, банковский перевод',
        parentOrganization: { '@id': `${this.baseUrl}/#organization` }
      },
      // 3. FAQPage
      ...(faqs.length > 0 ? [{
        '@type': 'FAQPage',
        '@id': `${this.baseUrl}/#faq`,
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer.replace(/<[^>]*>/g, '')
          }
        }))
      }] : [])
    ];

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    this.document.head.appendChild(script);
  }
}
