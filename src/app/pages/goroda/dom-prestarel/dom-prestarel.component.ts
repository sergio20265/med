import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../api.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {SeoService} from "../../../seo-service.service";
import {CommonModule} from "@angular/common";
import {BreadcumbComponent} from "../../../layaot/breadcumb/breadcumb.component";
import {TabViewModule} from "primeng/tabview";
import {DiagnosesListComponent} from "../../../layaot/diagnoses-list/diagnoses-list.component";
import {RehabilitationComponent} from "../../../layaot/rehabilitation/rehabilitation.component";
import {AppointmentFormComponent} from "../../../layaot/appointment-form/appointment-form.component";

@Component({
  selector: 'app-dom-prestarel',
  standalone:true,
  imports: [CommonModule,
    BreadcumbComponent,
    DiagnosesListComponent,
    RehabilitationComponent,
    TabViewModule,
    AppointmentFormComponent,],
  templateUrl: './dom-prestarel.component.html',
  styleUrls: ['./dom-prestarel.component.scss']
})
export class DomPrestarelComponent implements OnInit {
  gorod: any
  breadcrumbTitle: string = 'Дом престарелых'
  citySlug: string = ''

  constructor(private api: ApiService, private route: ActivatedRoute, private seo: SeoService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const cityParam = params.get('gorod');
      if (cityParam) {
        this.citySlug = cityParam;
        this.api.get_gorod_by_slug(cityParam).subscribe(r => {
          // @ts-ignore
          this.gorod = r.data
          // Обновляем заголовок хлебных крошек с названием города
          this.breadcrumbTitle = `Дом престарелых ${this.gorod.attributes.cityIn}`;
          
          this.seo.updateTitle(`Дом престарелых в ${this.gorod.attributes.cityIn} - круглосуточный медицинский уход, лечение и реабилитация`)
          this.seo.updateKeyWords(`дом престарелых в ${this.gorod.attributes.cityIn}, пансионат для пожилых в ${this.gorod.attributes.cityIn}, круглосуточный медицинский уход, лечение деменции, альцгеймер уход, паллиативная помощь, реабилитация после инсульта, медицинские манипуляции, социально-бытовая реабилитация, терминальные больные уход, профессиональный уход за пожилыми, медикаменты для пожилых, памперсы пеленки, ресторанное питание пансионат`)
        })
      } else {
        // Если нет параметра города, показываем общую страницу
        this.breadcrumbTitle = 'Дом престарелых';
        this.seo.updateTitle('Дом престарелых - пансионат для пожилых "Новая Медицина"');
      }
    })
  }

  getBreadcrumbs(): Array<{label: string, url?: string}> {
    const breadcrumbs: Array<{label: string, url?: string}> = [];
    
    // Добавляем ссылку на общую страницу дома престарелых
    breadcrumbs.push({label: 'Дом престарелых', url: '/dom-prestarel'});
    
    // Если есть информация о городе, добавляем его в хлебные крошки
    if (this.gorod && this.gorod.attributes) {
      breadcrumbs.push({label: `${this.gorod.attributes.cityTo}`});
    } else if (this.citySlug) {
      // Если город еще загружается, показываем slug
      breadcrumbs.push({label: this.citySlug});
    }
    
    return breadcrumbs;
  }

}
