import {AfterContentInit, Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

// declare console init_mobile_menu: any;
declare const init_mobile_menu:any
declare const menuToggle:any

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
export class HeaderComponent  {
  visible: boolean = false;

  menuItems: MenuItem[] = [
    {
      label: 'О нас',
      route: '/',
    
    },
    
    // {
    //   label: 'Персонал',
    //   route: '/staff'
    // },
    {
      label: 'Отзывы',
      route: '/video-reviews'
    },
    {
      label: 'Цены',
      route: '/price'
    },
    {
      label: 'Пациенту',
      route: '/service',
      children: [
        {
          label: 'Услуги',
          route: '/service'
        },
        {
          label: 'Рацион питания',
          route: '/patient/raczion'
        },
        {
          label: 'Транспортировка',
          route: 'transport',
        },
        {
          label: 'Реабилитация',
          route: '/rehabilitation'
        },
        {
          label: 'Диагнозы',
          route: '/diagnos'
        },
        {
          label: 'Лицензия',
          route: '/license'
        },
      ]
    },
    {
      label: 'Контакты',
      route: '/contact'
    }
  ];

  ngAfterViewInit(){
    // Check if we're in a browser environment before calling init_mobile_menu
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
}
