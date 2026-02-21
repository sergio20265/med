import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../api.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {SeoService} from "../../../seo-service.service";
import {CommonModule} from "@angular/common";
import {AppointmentFormComponent} from "../../../layaot/appointment-form/appointment-form.component";

@Component({
  selector: 'app-reabilitaciya-posle-insultov',
  standalone: true,
  imports: [CommonModule, AppointmentFormComponent],
  templateUrl: './reabilitaciya-posle-insultov.component.html',
  styleUrls: ['./reabilitaciya-posle-insultov.component.scss']
})
export class ReabilitaciyaPosleInsultovComponent implements OnInit {
  gorod: any
  breadcrumbTitle: string = 'Реабилитация после инсульта'
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
          this.breadcrumbTitle = `Реабилитация после инсульта ${this.gorod.attributes.cityIn}`;
          
          this.seo.updateTitle(`Реабилитация после инсульта в ${this.gorod.attributes.cityIn} - восстановление двигательных функций, речи и когнитивных способностей`)
          this.seo.updateDescription(`Комплексная реабилитация после инсульта в ${this.gorod.attributes.cityIn}. Восстановление двигательных функций, речи, памяти и когнитивных способностей. Индивидуальные программы реабилитации, ЛФК, физиотерапия, логопедия. Опытные специалисты, современное оборудование.`)
          this.seo.updateKeyWords(`реабилитация после инсульта в ${this.gorod.attributes.cityIn}, восстановление после инсульта в ${this.gorod.attributes.cityIn}, медицинский центр реабилитации, ЛФК после инсульта, восстановление речи, когнитивная реабилитация, физиотерапия, массаж после инсульта, эрготерапия, логопед после инсульта, нейрореабилитация, восстановление памяти, двигательная реабилитация`)
        })
      } else {
        // Если нет параметра города, показываем общую страницу
        this.breadcrumbTitle = 'Реабилитация после инсульта';
        this.seo.updateTitle('Реабилитация после инсульта - медицинский центр "Новая Медицина"');
        this.seo.updateDescription('Комплексная реабилитация после инсульта в медицинском центре "Новая Медицина". Восстановление двигательных функций, речи, памяти и когнитивных способностей. Индивидуальные программы реабилитации, ЛФК, физиотерапия, логопедия.');
      }
    })
  }

  getBreadcrumbs(): Array<{label: string, url?: string}> {
    const breadcrumbs: Array<{label: string, url?: string}> = [];
    
    // Добавляем ссылку на общую страницу реабилитации
    breadcrumbs.push({label: 'Реабилитация после инсульта', url: '/reabilitaciya-posle-insultov'});
    
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