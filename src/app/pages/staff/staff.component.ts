import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';

export interface StaffMember {
  name: string;
  role: string;
  photo: string;
}

export interface StaffGroup {
  category: string;
  icon: string;
  compact: boolean;
  members: StaffMember[];
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  standalone: true,
  imports: [BreadcumbComponent, NgFor, NgIf]
})
export class StaffComponent {

  staffGroups: StaffGroup[] = [

    // ── Руководство ─────────────────────────────────────────────
    {
      category: 'Руководство',
      icon: 'fas fa-star',
      compact: false,
      members: [
        {
          name: 'Жигарёв Антон Юрьевич',
          role: 'Директор стационара',
          photo: 'assets/img/team/Zhigaryov_Anton.jpg'
        },
        {
          name: 'Ганина Татьяна Евгеньевна',
          role: 'Заместитель директора',
          photo: ''
        },
      ]
    },

    // ── Врачи ────────────────────────────────────────────────────
    {
      category: 'Врачи',
      icon: 'fas fa-stethoscope',
      compact: false,
      members: [
        {
          name: 'Попова Елена Владимировна',
          role: 'Зав. отделением, врач-терапевт, гастроэнтеролог',
          photo: 'assets/img/dropme/popova.jpg'
        },
        {
          name: 'Стригунов Денис Юрьевич',
          role: 'Врач-невролог, нейрохирург, мануальный терапевт',
          photo: ''
        },
        {
          name: 'Левко Наталья Ивановна',
          role: 'Врач-УЗИ',
          photo: ''
        },
        {
          name: 'Ушаков Николай Александрович',
          role: 'Врач-инфекционист, врач-дерматовенеролог',
          photo: ''
        },
      ]
    },

    // ── Реабилитация ─────────────────────────────────────────────
    {
      category: 'Реабилитация',
      icon: 'fas fa-heartbeat',
      compact: false,
      members: [
        {
          name: 'Басиладзе Зураб Георгиевич',
          role: 'Реабилитолог',
          photo: 'assets/img/team/Basiladze_Zurab.jpg'
        },
        {
          name: 'Китаев Дмитрий',
          role: 'Инструктор ЛФК',
          photo: ''
        },
        {
          name: 'Анохин Николай',
          role: 'Инструктор ЛФК, кинезиотерапевт',
          photo: 'assets/img/team/Anohin_Nikolaj.jpg'
        },
        {
          name: 'Архаров Владимир',
          role: 'Помощник инструктора',
          photo: ''
        },
        {
          name: 'Латкин Дмитрий',
          role: 'Помощник инструктора',
          photo: ''
        },
      ]
    },

    // ── Медсёстры ────────────────────────────────────────────────
    {
      category: 'Медсёстры',
      icon: 'fas fa-user-nurse',
      compact: false,
      members: [
        {
          name: 'Пилипейко Тамара',
          role: 'Старшая медсестра',
          photo: 'assets/img/team/Pilipejko_Tamara.jpg'
        },
        { name: 'Власова Алина',      role: 'Палатная медсестра', photo: '' },
        { name: 'Былкина Кристина',   role: 'Палатная медсестра', photo: '' },
        { name: 'Вишнякова Ольга',    role: 'Палатная медсестра', photo: '' },
        { name: 'Беликова Алина',     role: 'Палатная медсестра', photo: '' },
        { name: 'Изюмова Светлана',   role: 'Палатная медсестра', photo: '' },
        { name: 'Панфилова Екатерина',role: 'Палатная медсестра', photo: '' },
      ]
    },

    // ── Санитарки ────────────────────────────────────────────────
    {
      category: 'Санитарки',
      icon: 'fas fa-hands-helping',
      compact: true,
      members: [
        { name: 'Уварова Ольга',         role: '', photo: '' },
        { name: 'Ефремова Евгения',       role: '', photo: 'assets/img/team/Efremova.jpg' },
        { name: 'Шивагорнова Светлана',   role: '', photo: '' },
        { name: 'Витмаер Ирина',          role: '', photo: '' },
        { name: 'Акишина Е.',             role: '', photo: '' },
        { name: 'Баганова Алла',          role: '', photo: 'assets/img/team/Baganova_Alla.jpg' },
        { name: 'Панфилова Людмила',      role: '', photo: '' },
      ]
    },

    // ── Буфетчицы ────────────────────────────────────────────────
    {
      category: 'Буфетчицы',
      icon: 'fas fa-utensils',
      compact: true,
      members: [
        { name: 'Маликова Оксана', role: '', photo: 'assets/img/team/Malikova_Oksana.jpg' },
        { name: 'Ибрагимова И.',   role: '', photo: '' },
      ]
    },

    // ── Прачечные ────────────────────────────────────────────────
    {
      category: 'Прачечные',
      icon: 'fas fa-tshirt',
      compact: true,
      members: [
        { name: 'Маликова Виктория', role: '', photo: '' },
        { name: 'Махова Ольга',      role: '', photo: '' },
      ]
    },

    // ── Администраторы ───────────────────────────────────────────
    {
      category: 'Администраторы',
      icon: 'fas fa-clipboard-list',
      compact: true,
      members: [
        { name: 'Алексеева Татьяна', role: '', photo: '' },
        { name: 'Боева Марина',      role: '', photo: '' },
      ]
    },

  ];

  /** Инициалы из имени для аватара-заглушки */
  initials(name: string): string {
    return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('');
  }

}
