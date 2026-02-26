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
    { src: 'assets/img/dropme/К8.png',    alt: 'Медицинский уход' },
    { src: 'assets/img/dropme/gal2.jpg',  alt: 'Условия проживания' },
    { src: 'assets/img/dropme/gal3.jpg',  alt: 'Коридор стационара' },
    { src: 'assets/img/dropme/gal4.jpg',  alt: 'Реабилитация' },
    { src: 'assets/img/dropme/К17.png',   alt: 'Занятия ЛФК' },
    { src: 'assets/img/dropme/gal7.jpg',  alt: 'Медицинский уход' },
    { src: 'assets/img/dropme/gal5.jpg',  alt: 'Территория' },
    { src: 'assets/img/dropme/455.jpg',   alt: 'Занятия' },
    { src: 'assets/img/dropme/reab3.jpg', alt: 'Условия' },
    { src: 'assets/img/dropme/gal8.jpg',  alt: 'Пациенты' },
    { src: 'assets/img/dropme/gal9.jpg',  alt: 'Палата' },
    { src: 'assets/img/dropme/К7.png',    alt: 'Уход' },
    { src: 'assets/img/dropme/gal10.jpg', alt: 'Восстановление' },
    { src: 'assets/img/dropme/gal11.jpg', alt: 'В стационаре' },
    { src: 'assets/img/dropme/gal12.jpg', alt: 'Помощь' },
    { src: 'assets/img/dropme/К9.jpg',    alt: 'Лечение' },
    { src: 'assets/img/dropme/reab5.jpg', alt: 'Реабилитация' },
    { src: 'assets/img/dropme/gal13.jpg', alt: 'Досуг' },
    { src: 'assets/img/dropme/gal14.jpg', alt: 'Отдых' },
    { src: 'assets/img/dropme/gal15.jpg', alt: 'Отдых' },
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
