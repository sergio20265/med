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
          photo: 'assets/img/team/zhigarev.webp'
        },
        {
          name: 'Ганина Татьяна Евгеньевна',
          role: 'Заместитель директора',
          photo: 'assets/img/team/ganina_te.webp'
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
          role: 'Главный врач, врач-терапевт, гастроэнтеролог<span>Стаж работы - 25лет</span>',
          photo: 'assets/img/team/popova_ev.webp'
        },
        {
          name: 'Стригунов Денис Юрьевич',
          role: 'Врач-невролог, нейрохирург, мануальный терапевт<span>Стаж работы - 11лет</span>',
          photo: 'assets/img/team/strigunov.webp'
        },
        {
          name: 'Левко Наталья Ивановна',
          role: 'Врач-УЗИ<span>Стаж работы - 36лет</span>',
          photo: 'assets/img/team/levko_ni.webp'
        },
        {
          name: 'Ушаков Николай Александрович',
          role: 'Врач-инфекционист, врач-дерматовенеролог<span>Стаж работы - 12лет</span>',
          photo: 'assets/img/team/ushakov.webp'
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
          name: 'Китаев Дмитрий',
          role: 'Инструктор ЛФК<span>Стаж работы - 8лет</span>',
          photo: 'assets/img/team/kitaev.webp'
        },
        {
          name: 'Анохин Николай',
          role: 'Инструктор ЛФК, кинезиотерапевт<span>Стаж работы - 3года</span>',
          photo: 'assets/img/team/anochin.webp'
        },
		{
          name: 'Латкин Дмитрий',
          role: 'Помощник инструктора',
          photo: 'assets/img/team/latkin.webp'
        },
        {
          name: 'Иванов Владимир',
          role: 'Помощник инструктора',
          photo: 'assets/img/team/ivanov.webp'
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
          role: 'Старшая медсестра<span>Стаж работы - 14лет</span>',
          photo: 'assets/img/team/pilipeyko.webp'
        },
        { name: 'Власова Алина',      role: 'Палатная медсестра<span>Стаж работы - 14лет</span>', photo: 'assets/img/team/vlasova.webp' },
        { name: 'Былкина Кристина',   role: 'Палатная медсестра<span>Стаж работы - 26лет</span>', photo: 'assets/img/team/bylkina.webp' },
        { name: 'Вишнякова Ольга',    role: 'Палатная медсестра<span>Стаж работы - 40лет</span>', photo: '' },
        { name: 'Беликова Алина',     role: 'Палатная медсестра<span>Стаж работы - 11лет</span>', photo: 'assets/img/team/belikova.webp' },
        { name: 'Изюмова Светлана',   role: 'Палатная медсестра<span>Стаж работы - 38лет</span>', photo: 'assets/img/team/izyumova.webp' },
        { name: 'Панфилова Екатерина',role: 'Палатная медсестра<span>Стаж работы - 38лет</span>', photo: '' },
      ]
    },

    // ── Санитарки ────────────────────────────────────────────────
    {
      category: 'Санитарки',
      icon: 'fas fa-hands-helping',
      compact: true,
      members: [
        { name: 'Уварова Ольга',         role: '', photo: 'assets/img/team/uvarova.webp' },
        { name: 'Ефремова Евгения',       role: '', photo: 'assets/img/team/efremova.webp' },
        { name: 'Шивагорнова Светлана',   role: '', photo: 'assets/img/team/shivagornova.webp' },
        { name: 'Витмаер Ирина',          role: '', photo: 'assets/img/team/vitmaer.webp' },
        { name: 'Акишина Е.',             role: '', photo: 'assets/img/team/akishina.webp' },
        { name: 'Баганова Алла',          role: '', photo: 'assets/img/team/Baganova_Alla.webp' },
        { name: 'Панфилова Людмила',      role: '', photo: 'assets/img/team/panfilova_l.webp' },
      ]
    },

    // ── Буфетчицы ────────────────────────────────────────────────
    {
      category: 'Буфетчицы',
      icon: 'fas fa-utensils',
      compact: true,
      members: [
        { name: 'Маликова Оксана', role: '', photo: 'assets/img/team/malikova.webp' },
        { name: 'Ибрагимова И.',   role: '', photo: 'assets/img/team/ibrahimova.webp' },
      ]
    },

    // ── Прачечные ────────────────────────────────────────────────
    {
      category: 'Прачечные',
      icon: 'fas fa-tshirt',
      compact: true,
      members: [
        { name: 'Маликова Виктория', role: '', photo: 'assets/img/team/malikova_v.webp' },
        { name: 'Махова Ольга',      role: '', photo: 'assets/img/team/makhova.webp' },
      ]
    },

    // ── Администраторы ───────────────────────────────────────────
    {
      category: 'Администраторы',
      icon: 'fas fa-clipboard-list',
      compact: true,
      members: [
        { name: 'Алексеева Татьяна', role: '', photo: 'assets/img/team/alekseeva.webp' },
        { name: 'Боева Марина',      role: '', photo: 'assets/img/team/boeva.webp' },
      ]
    },

  ];

  /** Инициалы из имени для аватара-заглушки */
  initials(name: string): string {
    return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('');
  }

}
