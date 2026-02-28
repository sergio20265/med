import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';
import { SeoService } from '../../seo-service.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styles: [],
  standalone: true,
  imports: [BreadcumbComponent, ReactiveFormsModule, NgIf]
})
export class ContactsComponent implements OnInit {

  formSent = false;
  transportFormSent = false;

  viewForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  transportForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  constructor(private seo: SeoService, private api: ApiService) {}

  ngOnInit(): void {
    this.seo.updateSeoData({
      title: 'Контакты стационара | Как добраться',
      description: 'Московская область, 90 км от Москвы. Карта проезда, телефон, запись на просмотр и консультацию врача.',
      keywords: 'контакты, адрес, телефон, как добраться, реабилитационный стационар',
      url: 'https://nmrehab.ru/contact',
      schemaType: 'medicalBusiness',
      breadcrumbs: [
        { name: 'Главная',  url: 'https://nmrehab.ru/' },
        { name: 'Контакты', url: 'https://nmrehab.ru/contact' },
      ]
    });
  }

  submitView(): void {
    if (this.viewForm.valid) {
      const { name, phone } = this.viewForm.value;
      this.api.sendFormNotification(name!, phone!, '📅 Запись на просмотр (контакты)');
      this.formSent = true;
      this.viewForm.reset();
    }
  }

  submitTransport(): void {
    if (this.transportForm.valid) {
      const { name, phone } = this.transportForm.value;
      this.api.sendFormNotification(name!, phone!, '🚑 Перевозка пациента');
      this.transportFormSent = true;
      this.transportForm.reset();
    }
  }
}
