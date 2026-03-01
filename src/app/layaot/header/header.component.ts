import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';

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
  imports: [NgIf, RouterLink, NgFor, ReactiveFormsModule]
})
export class HeaderComponent {
  constructor(private api: ApiService) {}

  visible: boolean = false;
  showCallback: boolean = false;
  callbackSent = false;
  expandedItems = new Set<string>();

  callbackForm = new FormGroup({
    name:  new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  toggleSubmenu(label: string): void {
    if (this.expandedItems.has(label)) {
      this.expandedItems.delete(label);
    } else {
      this.expandedItems.add(label);
    }
  }

  isExpanded(label: string): boolean {
    return this.expandedItems.has(label);
  }

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
      label: 'Цены',
      route: '/price'
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
    if (!this.visible) {
      this.expandedItems.clear();
    }
  }

  submitCallback(): void {
    if (this.callbackForm.valid) {
      const { name, phone } = this.callbackForm.value;
      this.api.sendFormNotification(name!, phone!, '📞 Перезвоните мне (шапка)');
      this.callbackSent = true;
      this.callbackForm.reset();
    }
  }

  toggleCallback() {
    this.showCallback = !this.showCallback;
    if (this.showCallback) {
      this.callbackSent = false;
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
