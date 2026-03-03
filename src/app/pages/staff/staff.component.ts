import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';

export interface StaffMember {
  name: string;
  role: string;
  photo: string;
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  standalone: true,
  imports: [BreadcumbComponent, NgFor, NgIf]
})
export class StaffComponent {

  staff: StaffMember[] = [
    // Руководство
    { name: 'Жигарёв Антон Юрьевич',       role: 'Директор стационара',                                                                     photo: 'assets/img/team/zhigarev.webp' },
    { name: 'Ганина Татьяна Евгеньевна',    role: 'Заместитель директора',                                                                   photo: 'assets/img/team/ganina_te.webp' },
    // Врачи
    { name: 'Попова Елена Владимировна',    role: 'Главный врач, врач-терапевт, гастроэнтеролог<span>Стаж работы — 25 лет</span>',            photo: 'assets/img/team/popova_ev.webp' },
    { name: 'Стригунов Денис Юрьевич',      role: 'Врач-невролог, нейрохирург, мануальный терапевт<span>Стаж работы — 11 лет</span>',         photo: 'assets/img/team/strigunov.webp' },
    { name: 'Левко Наталья Ивановна',       role: 'Врач-УЗИ<span>Стаж работы — 36 лет</span>',                                               photo: 'assets/img/team/levko_ni.webp' },
    { name: 'Ушаков Николай Александрович', role: 'Врач-инфекционист, врач-дерматовенеролог<span>Стаж работы — 12 лет</span>',                photo: 'assets/img/team/ushakov.webp' },
    // Реабилитация
    { name: 'Китаев Дмитрий',              role: 'Реабилитолог<span>Стаж работы — 8 лет</span>',                                             photo: 'assets/img/team/kitaev.webp' },
    { name: 'Анохин Николай',              role: 'Реабилитолог, кинезиотерапевт<span>Стаж работы — 3 года</span>',                           photo: 'assets/img/team/anochin.webp' },
    { name: 'Латкин Дмитрий',             role: 'Инструктор ЛФК',                                                                           photo: 'assets/img/team/latkin.webp' },
    { name: 'Иванов Владимир',            role: 'Инструктор ЛФК',                                                                           photo: 'assets/img/team/ivanov.webp' },
    // Медсёстры
    { name: 'Пилипейко Тамара',           role: 'Старшая медсестра<span>Стаж работы — 14 лет</span>',                                       photo: 'assets/img/team/pilipeyko.webp' },
    { name: 'Власова Алина',              role: 'Палатная медсестра<span>Стаж работы — 14 лет</span>',                                      photo: 'assets/img/team/vlasova.webp' },
    { name: 'Былкина Кристина',           role: 'Палатная медсестра<span>Стаж работы — 26 лет</span>',                                      photo: 'assets/img/team/bylkina.webp' },
    { name: 'Вишнякова Ольга',            role: 'Палатная медсестра<span>Стаж работы — 40 лет</span>',                                      photo: 'assets/img/team/vishnyakova.webp' },
    { name: 'Беликова Алина',             role: 'Палатная медсестра<span>Стаж работы — 11 лет</span>',                                      photo: 'assets/img/team/belikova.webp' },
    { name: 'Изюмова Светлана',           role: 'Палатная медсестра<span>Стаж работы — 38 лет</span>',                                      photo: 'assets/img/team/izuyomova.webp' },
    { name: 'Панфилова Екатерина',        role: 'Палатная медсестра<span>Стаж работы — 38 лет</span>',                                      photo: 'assets/img/team/panfilova_e.webp' },
    // Санитарки
    { name: 'Уварова Ольга',              role: 'Санитарка',             photo: 'assets/img/team/uvarova.webp' },
    { name: 'Ефремова Евгения',           role: 'Санитарка',             photo: 'assets/img/team/efremova.webp' },
    { name: 'Шивагорнова Светлана',       role: 'Санитарка',             photo: 'assets/img/team/shivagornova.webp' },
    { name: 'Витмаер Ирина',              role: 'Санитарка',             photo: 'assets/img/team/vitmaer.webp' },
    { name: 'Акишина Елена',                 role: 'Санитарка',             photo: 'assets/img/team/akishina.webp' },
    { name: 'Баганова Алла',              role: 'Санитарка',             photo: 'assets/img/team/baganova_a.webp' },
    { name: 'Панфилова Людмила',          role: 'Санитарка',             photo: 'assets/img/team/panfilova_l.webp' },
    // Буфетчицы
    { name: 'Маликова Оксана',            role: 'Буфетчица',             photo: 'assets/img/team/malikova.webp' },
    { name: 'Ибрагимова Ирина',              role: 'Буфетчица',             photo: 'assets/img/team/ibrahimova.webp' },
    // Прачечные
    { name: 'Маликова Виктория',          role: 'Работник прачечной',    photo: 'assets/img/team/malikova_v.webp' },
    { name: 'Махова Ольга',               role: 'Работник прачечной',    photo: 'assets/img/team/makhova.webp' },
    // Администраторы
    { name: 'Алексеева Татьяна',          role: 'Администратор',         photo: 'assets/img/team/alekseeva.webp' },
    { name: 'Боева Марина',               role: 'Администратор',         photo: 'assets/img/team/boeva.webp' },
  ];

  initials(name: string): string {
    return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('');
  }
}
