import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

declare const init_mobile_menu: any;

interface MenuItem {
  label: string;
  route: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
  standalone: true,
  imports: [NgIf, RouterLink, NgFor]
})
export class HeaderComponent {
  visible: boolean = false;
  showCallback: boolean = false;

  menuItems: MenuItem[] = [
    {
      label: 'Главная',
      route: '/',
    },
    {
      label: 'Направления',
      route: '/diagnos',
      children: [
        { label: 'Реабилитация после инсульта', route: '/rehabilitation/insult' },
        { label: 'Перелом шейки бедра', route: '/rehabilitation/perelom-shejki-bedra' },
        { label: 'После эндопротезирования', route: '/rehabilitation/endoprotezirovanie' },
        { label: 'Деменция / Альцгеймер', route: '/diagnos/demenciya' },
        { label: 'Болезнь Паркинсона', route: '/diagnos/parkinson' },
        { label: 'Паллиативная помощь', route: '/diagnos/palliativ' },
      ]
    },
    {
      label: 'О нас',
      route: '/about',
      children: [
        { label: 'Персонал', route: '/staff' },
        { label: 'Лицензии', route: '/license' },
        { label: 'Отзывы', route: '/video-reviews' },
      ]
    },
    {
      label: 'Пациенту',
      route: '/patient'
    },
    {
      label: 'Контакты',
      route: '/contact'
    }
  ];

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      try {
        init_mobile_menu();
      } catch (error) {
        console.error('Error initializing mobile menu:', error);
      }
    }
  }

  close_menu() {
    this.visible = !this.visible;
  }

  toggleCallback() {
    this.showCallback = !this.showCallback;
    if (this.showCallback) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeCallbackOverlay(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('hdr-popup-overlay')) {
      this.toggleCallback();
    }
  }
}
