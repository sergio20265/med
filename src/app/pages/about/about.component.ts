import { Component, OnInit, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';
import { SeoService } from '../../seo-service.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
  imports: [BreadcumbComponent, ReactiveFormsModule, NgIf, NgFor]
})
export class AboutComponent implements OnInit {

  formSent    = false;
  consultSent = false;
  activeTab   = 'diagnoses';

  // ── Лайтбокс ────────────────────────────────────────────
  lightboxOpen  = false;
  lightboxIndex = 0;

  openLightbox(i: number): void {
    this.lightboxIndex = i;
    this.lightboxOpen  = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }

  lightboxNext(): void {
    this.lightboxIndex = (this.lightboxIndex + 1) % this.galleryImages.length;
  }

  lightboxPrev(): void {
    this.lightboxIndex = (this.lightboxIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape')     this.closeLightbox();
    if (e.key === 'ArrowRight') this.lightboxNext();
    if (e.key === 'ArrowLeft')  this.lightboxPrev();
  }

  // ── Формы ────────────────────────────────────────────────
  viewForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  consultForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  // ── Галерея (те же фото, что на главной) ─────────────────
  galleryImages = [
    { src: 'assets/img/dropme/К8.webp',    alt: 'Медицинский уход' },
    { src: 'assets/img/dropme/gal2.webp',  alt: 'Условия проживания' },
	{ src: 'assets/img/dropme/gal6.webp',  alt: 'стационар' },
    { src: 'assets/img/dropme/gal3.webp',  alt: 'Коридор стационара' },
	{ src: 'assets/img/dropme/gal12.webp', alt: 'Помощь' },
    { src: 'assets/img/dropme/gal4.webp',  alt: 'Реабилитация' },
    { src: 'assets/img/dropme/К17.webp',   alt: 'Занятия ЛФК' },
    { src: 'assets/img/dropme/gal7.webp',  alt: 'Медицинский уход' },
    { src: 'assets/img/dropme/gal5.webp',  alt: 'Территория' },
    { src: 'assets/img/dropme/reab3.webp', alt: 'Условия' },
    { src: 'assets/img/dropme/gal8.webp',  alt: 'Пациенты' },
    { src: 'assets/img/dropme/gal9.webp',  alt: 'Палата' },
    { src: 'assets/img/dropme/К7.webp',    alt: 'Уход' },
    { src: 'assets/img/dropme/gal10.webp', alt: 'Восстановление' },
	{ src: 'assets/img/dropme/gal51.webp',    alt: 'Лечение' },
    { src: 'assets/img/dropme/К9.webp',    alt: 'Лечение' },
    { src: 'assets/img/dropme/reab5.webp', alt: 'Реабилитация' },
	{ src: 'assets/img/dropme/gal15.webp', alt: 'Отдых' },
    { src: 'assets/img/dropme/gal13.webp', alt: 'Досуг' },
    { src: 'assets/img/dropme/gal14.webp', alt: 'Отдых' },
	{ src: 'assets/img/dropme/К10.webp', alt: 'Палата' },
  ];

  diagnoses = [
    'Артрит', 'Болезни опорно-двигательного аппарата', 'Болезнь Альцгеймера',
    'Болезнь Паркинсона', 'Варикоз', 'Гипертония', 'Деменция', 'Депрессия',
    'Заболевания нервной системы', 'Заболевания суставов', 'Запоры', 'Катаракта',
    'Неврозы', 'Остеопороз', 'Остеохондроз', 'Перенесённый инсульт',
    'Перенесённый инфаркт', 'Подагра', 'Сахарный диабет',
    'Сердечно-сосудистые заболевания', 'Старческое слабоумие',
    'Травмы и переломы различной тяжести', 'Энурез',
  ];

  rehabilitation = [
    'Болезнь Альцгеймера', 'Болезнь Паркинсона', 'Лечение деменции',
    'Лечение переломов у пожилых', 'Перелом шейки бедра', 'После инсульта',
    'После инфаркта', 'После остеохондроза', 'Рассеянный склероз',
    'Реабилитация после операций', 'Реабилитация суставов',
    'Уход за больными с сахарным диабетом', 'Уход за лежачими больными',
  ];

  constructor(private seo: SeoService, private api: ApiService) {}

  ngOnInit(): void {
    this.seo.updateSeoData({
      title: 'О нас — Реабилитационный стационар «Новая медицина»',
      description: 'Реабилитационный стационар в составе сети медицинских центров «Новая медицина». Более 15 лет работы, 9 медицинских центров, лицензированная деятельность.',
      keywords: 'о нас, реабилитационный стационар, Новая медицина, стационар пожилых, реабилитация',
      url: 'https://nmrehab.ru/about',
      schemaType: 'medicalBusiness',
      breadcrumbs: [
        { name: 'Главная', url: 'https://nmrehab.ru/' },
        { name: 'О нас',   url: 'https://nmrehab.ru/about' },
      ]
    });
  }

  submitView(): void {
    if (this.viewForm.valid) {
      const { name, phone } = this.viewForm.value;
      this.api.send_telegram(505467091,
        `📅 Запись на просмотр\nИмя: ${name}\nТелефон: ${phone}`
      ).subscribe();
      this.formSent = true;
      this.viewForm.reset();
    }
  }

  submitConsult(): void {
    if (this.consultForm.valid) {
      const { name, phone } = this.consultForm.value;
      this.api.send_telegram(505467091,
        `💬 Консультация (О нас)\nИмя: ${name}\nТелефон: ${phone}`
      ).subscribe();
      this.consultSent = true;
      this.consultForm.reset();
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }
}
