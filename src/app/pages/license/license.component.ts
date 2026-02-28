import { Component, OnInit } from '@angular/core';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';
import { SeoService } from '../../seo-service.service';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
  standalone: true,
  imports: [BreadcumbComponent]
})
export class LicenseComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updateSeoData({
      title: 'Лицензия и документы стационара',
      description: 'Официальная медицинская лицензия, реквизиты и документы. Работаем по договору.',
      keywords: 'лицензия, медицинская деятельность, разрешения, документы, официальная медицина',
      url: 'https://nmrehab.ru/license',
      schemaType: 'medicalBusiness',
      breadcrumbs: [
        { name: 'Главная',  url: 'https://nmrehab.ru/' },
        { name: 'Лицензия', url: 'https://nmrehab.ru/license' },
      ]
    });
  }
}