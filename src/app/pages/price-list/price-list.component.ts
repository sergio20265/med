import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';
import { SeoService } from '../../seo-service.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styles: [],
  standalone: true,
  imports: [BreadcumbComponent, ReactiveFormsModule, NgIf]
})
export class PriceListComponent implements OnInit {

  formSent = false;

  priceForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  constructor(private seo: SeoService, private api: ApiService) {}

  ngOnInit(): void {
    this.seo.updateSeoData({
      title: 'Стоимость ухода и реабилитации в стационаре',
      description: 'Прозрачные цены от 2 000 ₽/сутки. Без скрытых платежей. Официальный договор. Бесплатная консультация врача.',
      keywords: 'цены, стоимость, уход, реабилитация, стационар, прайс, договор',
      url: 'https://nmrehab.ru/price',
      schemaType: 'medicalBusiness',
      breadcrumbs: [
        { name: 'Главная', url: 'https://nmrehab.ru/' },
        { name: 'Цены',    url: 'https://nmrehab.ru/price' },
      ]
    });
  }

  submitPrice(): void {
    if (this.priceForm.valid) {
      const { name, phone } = this.priceForm.value;
      this.api.send_telegram(505467091,
        `💰 Запрос стоимости\nИмя: ${name}\nТелефон: ${phone}`
      ).subscribe();
      this.formSent = true;
      this.priceForm.reset();
    }
  }
}
