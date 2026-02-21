import {AfterContentInit, Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {SeoService} from "./seo-service.service";
import {filter, map, mergeMap} from "rxjs";
import { FooterComponent } from './layaot/footer/footer.component';
import { HeaderComponent } from './layaot/header/header.component';
import { Location, isPlatformServer } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, FooterComponent]
})
export class AppComponent implements OnInit, AfterContentInit {
  title = 'stacionar-site';

  constructor(
       private seoService: SeoService,
       private router: Router,
       private activatedRoute: ActivatedRoute,
       private location: Location,
       @Inject(PLATFORM_ID) private platformId: Object
     ) {
     }

  private applySeoFromRouteData(data: Record<string, unknown>): void {
    const seoData = {
      title: data['title'] as string | undefined,
      description: data['description'] as string | undefined,
      keywords: data['keywords'] as string | undefined,
      url: data['canonical'] as string | undefined,
      robots: data['robots'] as string | undefined
    };
    this.seoService.updateSeoData(seoData);
  }

  ngOnInit(): void {
     // SEO при первой загрузке из текущего маршрута (SSR и клиент)
     let route = this.activatedRoute;
     while (route.firstChild) route = route.firstChild;
     this.applySeoFromRouteData(route.snapshot.data);

     // SEO при последующих переходах
     this.router.events.pipe(
       filter(e => e instanceof NavigationEnd),
       map(e => this.activatedRoute),
       map((route) => {
         while (route.firstChild) route = route.firstChild;
         return route;
       }),
       filter((route) => route.outlet === 'primary'),
       mergeMap((route) => route.data),
     ).subscribe(data => this.applySeoFromRouteData(data));
     // Yandex Metrika отслеживание переходов
       if (!isPlatformServer(this.platformId)) {
         let prevPath = this.location.path();
         this.router.events
           .pipe(filter(event => event instanceof NavigationEnd))
           .subscribe(() => {
             const newPath = this.location.path();
             // Используем прямой вызов ym функции
             if (typeof (window as any).ym !== 'undefined') {
               (window as any).ym(96483162, 'hit', newPath, {
                 referer: prevPath,
                 callback: () => { console.log('Yandex Metrika hit sent for:', newPath); }
               });
             }
             prevPath = newPath;
           });
       }
    // this.title.setTitle('Частный стационар "Новая медицина"')
    // this.metaTagService.addTags([
    //   // {'title':'Cта111'},
    //   {
    //     name: 'keywords',
    //     content: 'Angular SEO Integration, Music CRUD, Angular Universal',
    //   },
    //   {name: 'robots', content: 'index, follow'},
    //   {name: 'author', content: 'vollodey'},
    //   {name: 'viewport', content: 'width=device-width, initial-scale=1'},
    //   // {name: 'date', content: '2019-10-31', scheme: 'YYYY-MM-DD'},
    //   {charset: 'UTF-8'},
    // ]);
    // ParallaxEffect()
    // init_js()
    //   this.router.events.subscribe(event => {
    //     console.log(event)
    //     if(event instanceof NavigationEnd) {
    //       // alert('123')
    //        init_js()
    //     }
    //   })
  }

  ngAfterContentInit(): void {
    // ParallaxEffect()
  }

}
