import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ApiService} from "../../api.service";
import {SeoService} from "../../seo-service.service";
import { RehabilitationComponent } from '../../layaot/rehabilitation/rehabilitation.component';
import { DiagnosesListComponent } from '../../layaot/diagnoses-list/diagnoses-list.component';
import { TabViewModule } from 'primeng/tabview';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-diagnos',
    templateUrl: './diagnos.component.html',
    styleUrls: ['./diagnos.component.scss'],
    standalone: true,
    imports: [NgIf, BreadcumbComponent, TabViewModule, DiagnosesListComponent, RehabilitationComponent]
})
export class DiagnosComponent implements OnInit {
  diagnos_detail: any
  gorod: any

  constructor(private router: ActivatedRoute, private api: ApiService, private seo: SeoService) {
  }

  ngOnInit(): void {
    this.router.params.subscribe((params: Params) => {
      this.api.get_diagnos_detail_by_slug(params['slug']).subscribe(r => {
        this.diagnos_detail = r;
        if (params.hasOwnProperty('gorod')) {
          this.api.get_gorod_by_slug(String(params['gorod'])).subscribe(gorodRes => {
            this.gorod = (gorodRes as any).data;
            this.applySeo();
          });
        } else {
          this.applySeo();
        }
      });
    });
  }

  private applySeo(): void {
    const title = this.diagnos_detail?.data?.attributes?.title;
    const cityName = this.gorod?.attributes?.cityIn ?? this.gorod?.attributes?.name;
    const cityLabel = cityName ? ` в ${cityName}` : '';
    const seoTitle = title
      ? `${title} - лечение${cityLabel} для пожилых | Стационар "Новая медицина"`
      : undefined;
    const keywords = title
      ? `${title}, ${this.gorod?.attributes?.name ?? ''}, пансионат для пожилых${cityLabel}, лечение, стационар`
      : undefined;
    const description = title
      ? `Профессиональное лечение "${title}" в частном стационаре "Новая медицина"${cityLabel}. Индивидуальный подход, современные методы терапии.`
      : undefined;
    this.seo.updateSeoData({
      title: seoTitle,
      description,
      keywords
    });
  }
}
