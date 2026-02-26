import {Component, ElementRef, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';

declare function ParallaxEffect(): any;


@Component({
  standalone:true,
  imports:[CommonModule, RouterModule],
  selector: 'app-breadcumb',
  templateUrl: './breadcumb.component.html',
  styleUrls: ['./breadcumb.component.scss']
})
export class BreadcumbComponent implements OnInit, OnDestroy, OnChanges {
  @Input() title: string | undefined
  @Input() customBreadcrumbs: Array<{label: string, url?: string}> = []
  ParallaxEffect_init: boolean = true
  breadcrumbs: Array<{label: string, url?: string}> = []
  private routerSubscription: Subscription = new Subscription()

  constructor(private route: ActivatedRoute, private router: Router) {

  }

  @ViewChild('ParallaxEffect')
  set watch(detailgallery: ElementRef) {
    if (detailgallery) {
      ParallaxEffect()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Обновляем breadcrumbs при изменении title
    if (changes['title'] && !changes['title'].firstChange) {
      this.generateBreadcrumbs();
    }
  }

  ngOnInit(): void {
    this.routerSubscription.add(
      this.route.data.subscribe(r => {
        if (this.title === undefined) {
          this.title = r['title']
        }
      })
    );
    
    // Генерируем хлебные крошки при инициализации
    this.generateBreadcrumbs();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
  
  private generateBreadcrumbs(): void {
    // Если переданы кастомные хлебные крошки, используем их
    if (this.customBreadcrumbs.length > 0) {
      this.breadcrumbs = [{label: 'Главная', url: '/'}, ...this.customBreadcrumbs];
      return;
    }
    
    // Автоматическая генерация хлебных крошек на основе URL
    const urlSegments = this.router.url.split('/').filter(segment => segment);
    this.breadcrumbs = [{label: 'Главная', url: '/'}];
    
    let currentUrl = '';
    
    urlSegments.forEach((segment, index) => {
      currentUrl += `/${segment}`;
      
      // Определяем название сегмента
      let label = this.getSegmentLabel(segment, index, urlSegments);
      
      // Добавляем в хлебные крошки (последний элемент без ссылки)
      if (index === urlSegments.length - 1) {
        // Для последнего элемента используем переданный title, если он есть
        const finalLabel = this.title || label;
        this.breadcrumbs.push({label: finalLabel});
      } else {
        this.breadcrumbs.push({label: label, url: currentUrl});
      }
    });
  }
  
  private getSegmentLabel(segment: string, index: number, allSegments: string[]): string {
    // Специальная обработка для различных сегментов URL
    switch (segment) {
      case 'stacionar':
        return 'Стационар';
      case 'dom-prestarelyh':
        return 'Дом престарелых';
      case 'staff':
        return 'Персонал';
      case 'diagnos':
        return 'Диагнозы';
      case 'rehabilitation':
        return 'Реабилитация';
      case 'about':
        return 'О нас';
      case 'contact':
        return 'Контакты';
      case 'service':
        return 'Услуги';
      case 'price':
        return 'Цены';
      case 'raczion':
        return 'Рацион питания';
      case 'patient':
        return 'Пациентам';
      case 'transport':
        return 'Транспорт';
      case 'license':
        return 'Лицензия';
      case 'article':
        return 'Статьи';
      case 'video-reviews':
        return 'Видео отзывы';
      case 'price-list':
        return 'Прайс-лист';
      case 'diagnos':
        return 'Диагнозы';
      default:
        // Для городов и других динамических сегментов
        if (index > 0 && (allSegments[index - 1] === 'stacionar' || allSegments[index - 1] === 'dom-prestarelyh')) {
          // Это название города - возвращаем как есть, будет заменено в компоненте
          return segment;
        }
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  }
}
